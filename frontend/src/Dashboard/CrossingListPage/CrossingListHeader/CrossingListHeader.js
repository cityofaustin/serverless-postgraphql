import React, { Component } from 'react';
import './CrossingListHeader.css';
import {ContainerQuery} from 'react-container-query';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const containerQuery = {
  'fullsize': { minWidth: 768 },
  'smallsize': { maxWidth: 767 }
};

class CrossingListHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterDrawer: false,
      invertSort: false
    };
  }

  toggleFilterDropdown = () => { this.setState({ showFilterDrawer: !this.state.showFilterDrawer }) };
  toggleSortDirection = () => { this.setState({ invertSort: !this.state.invertSort }) };

  render() {
    if ( !this.props.data || this.props.data.loading) {
      return '';
    };

    const { openCrossings, closedCrossings, cautionCrossings, longtermCrossings } = this.props.data;

    return (
      <ContainerQuery query={containerQuery}>
        {(params) => (
          <div className={classnames(params, 'CrossingListHeader')}>
            <div className={classnames(params, 'CrossingListSearch')}>
              <input type="text" className={classnames(params, 'CrossingListSearchInput')} placeholder="Search your crossings"/>
              <div className={classnames(params, 'CrossingListSearchButton')}>
                <FontAwesome name="search" />
              </div>
            </div>

            {params.smallsize ? (
              <div className='smallflex'>
                <div className={classnames(params, 'CrossingListSortToggle')} onClick={this.toggleSortDirection}>
                  <div className={classnames(params, 'CrossingListSortToggleText')}>
                    LAST UPDATED {this.state.invertSort ? <FontAwesome name="caret-up" /> : <FontAwesome name="caret-down" />}
                  </div>
                </div>
                <div className={classnames(params, 'CrossingListFilterToggle', {'selected': this.state.showFilterDrawer})} onClick={this.toggleFilterDropdown}>
                  <div className={classnames(params, 'CrossingListFilterToggleText')}>
                    FILTER {this.state.showFilterDrawer ? <FontAwesome name="minus" /> : <FontAwesome name="plus" />}
                  </div>
                </div>
              </div>
            ) : (
              <div className={classnames(params, 'CrossingListSortToggle')} onClick={this.toggleSortDirection}>
                <div className={classnames(params, 'CrossingListSortToggleText')}>
                  LAST UPDATED {this.state.invertSort ? <FontAwesome name="caret-up" /> : <FontAwesome name="caret-down" />}
                </div>
              </div>
            )}

            {params.smallsize && !this.state.showFilterDrawer ? "" : (
              <div className={classnames(params, 'CrossingListFilter')}>
                <div className={classnames(params, 'CrossingListFilterItem')}>
                  <input className={classnames(params, 'CrossingListFilterCheckbox')} type='checkbox'/>
                  Open ({openCrossings.totalCount})
                </div>
                <div className={classnames(params, 'CrossingListFilterItem')}>
                  <input className={classnames(params, 'CrossingListFilterCheckbox')} type='checkbox'/>
                  Caution ({cautionCrossings.totalCount})
                </div>
                <div className={classnames(params, 'CrossingListFilterItem')}>
                  <input className={classnames(params, 'CrossingListFilterCheckbox')} type='checkbox'/>
                  Closed ({closedCrossings.totalCount})
                </div>
                <div className={classnames(params, 'CrossingListFilterItem')}>
                  <input className={classnames(params, 'CrossingListFilterCheckbox')} type='checkbox'/>
                  Long Term Closure ({longtermCrossings.totalCount})
                </div>
              </div> 
            )}
          </div>
        )}
      </ContainerQuery>
    );
  }
}

const crossingStatusCountQuery = gql`
  {
    openCrossings: allCrossings(condition: {latestStatusId: 1}) {
      totalCount
    }
    closedCrossings: allCrossings(condition: {latestStatusId: 2}) {
      totalCount
    }
    cautionCrossings: allCrossings(condition: {latestStatusId: 3}) {
      totalCount
    }
    longtermCrossings: allCrossings(condition: {latestStatusId: 4}) {
      totalCount
    }
  }
`;

export default graphql(crossingStatusCountQuery)(CrossingListHeader);
