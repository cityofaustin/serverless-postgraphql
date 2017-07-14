import HttpTransport from 'lokka-transport-http';
import Lokka from 'lokka';

const anonLokka = new Lokka({transport: new HttpTransport('http://localhost:5000/graphql')});
const communityEditorEmail = 'editor@community.floods';
const communityEditorPassword = 'texasfloods';

async function getToken(email, password) {
  const response = await anonLokka.send(`
    mutation($email:String!, $password:String!) {
      authenticate(input: {email: $email, password: $password}) {
        jwtToken
      }
    }
  `,
  {
    email: email,
    password: password
  });

  return response.authenticate.jwtToken;
}

describe('As a community editor', async () => {
  var lokka;

  beforeAll(async (done) => {
    getToken(communityEditorEmail, communityEditorPassword).then((token) => {
      const headers = {
        'Authorization': 'Bearer '+ token
      };
      lokka = new Lokka({transport: new HttpTransport('http://localhost:5000/graphql', {headers})});
      done();
    });
  });

  describe('When adding a crossing', () => {

    describe('to the same community as the user', () => {
      var newCrossingId;

      it('before updating it should get the current crossings', async () => {
        const response = await lokka.send(`
          {
            allCrossings {
              nodes {
                id
              }
            }
          }
        `);

        expect(response).not.toBeNull();
      });

      it('should add the crossing', async () => {
        const response = await lokka.send(`
          mutation {
            newCrossing(input: {
              name: "New Crossing"
              humanAddress: "Near the barn"
              description: "Describe!"
              communityId: 1
            }) {
              crossing {
                id
              }
            }
          }
        `);

        newCrossingId = response.newCrossing.crossing.id;
        expect(response).not.toBeNull();
      });

      it('the new crossing should show up in the DB', async () => {
        const response = await lokka.send(`
          query ($id: Int!) {
            crossingById(id: $id) {
              name
              humanAddress
              description
              communityCrossingsByCrossingId {
                nodes {
                  communityId
                }
              }
            }
          }
        `,
        {
          id: newCrossingId
        });

        expect(response).toMatchSnapshot();
      });

      it('should fail to delete the new crossing', async () => {
        var err;
        try {
          const response = await lokka.send(`
            mutation ($id: Int!) {
              removeCrossing(input: {crossingId: $id}) {
                crossing {
                  id
                }
              }
            }      
            `,
            {
              id: newCrossingId
            });
        } catch(e) {
          expect(e).toMatchSnapshot();
        }
      });
    });

    describe('NOT to the same community as the user', () => {
      it('should fail to add the crossing', async () => {
        try {
          const response = await lokka.send(`
            mutation {
              newCrossing(input: {
                name: "New Crossing"
                humanAddress: "Near the barn"
                description: "Describe!"
                communityId: 2
              }) {
                crossing {
                  id
                }
              }
            }
        `);
        } catch(e) {
          expect(e).toMatchSnapshot();
        }
      });
    });

  });

  it('should get the correct current user', async () => {
    const response = await lokka.send(`
      {
        currentUser {
          id
        }
      }
    `);

    expect(response).toMatchSnapshot();
  });

  it('should fail to register a new user', async () => {
    try {
      const response = await anonLokka.send(`
        mutation {
          registerUser(input: {
            firstName: "New",
            lastName: "User",
            jobTitle: "Community Admin",
            communityId: 1,
            phoneNumber: "555-6666",
            email: "new@us.er",
            password:"texasfloods",
            role:"floods_community_admin"
          }) {
            user {
              id
            }
          }
        }
    `);
    } catch(e) {
      expect(e).toMatchSnapshot();
    }
  });
});
