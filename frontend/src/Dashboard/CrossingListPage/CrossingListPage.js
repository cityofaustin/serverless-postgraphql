import React, { Component } from 'react';
import LinkButton from '../../LinkButton';
import BulkActionsDropdown from '../Table/BulkActionsDropdown';
import TableSearch from '../Table/TableSearch';
import CrossingList from './CrossingList';
import CrossingListHeader from './CrossingListHeader/CrossingListHeader';
import './CrossingListPage.css';

class CrossingListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByUpdatedAsc: false,
      showOpen: true,
      showClosed: true,
      showCaution: true,
      showLongterm: true
    };
  }

  toggleShowOpen = () => { this.setState({ showOpen: !this.state.showOpen }) };
  toggleShowClosed = () => { this.setState({ showClosed: !this.state.showClosed }) };
  toggleShowCaution = () => { this.setState({ showCaution: !this.state.showCaution }) };
  toggleShowLongterm = () => { this.setState({ showLongterm: !this.state.showLongterm }) };
  toggleSortByUpdated = () => { this.setState({sortByUpdatedAsc: !this.state.sortByUpdatedAsc }) };

  render() {
    return (
      <div className="CrossingListPage">
        <CrossingListHeader
          showOpen={this.state.showOpen}
          toggleShowOpen={this.toggleShowOpen}
          showClosed={this.state.showClosed}
          toggleShowClosed={this.toggleShowClosed}
          showCaution={this.state.showCaution}
          toggleShowCaution={this.toggleShowCaution}
          showLongterm={this.state.showLongterm}
          toggleShowLongterm={this.toggleShowLongterm}
          toggleSortByUpdated={this.toggleSortByUpdated} 
          sortByUpdatedAsc={this.state.sortByUpdatedAsc} />
        <CrossingList {...this.props}
          showOpen={this.state.showOpen}
          showCaution={this.state.showCaution}
          showClosed={this.state.showClosed}
          showLongterm={this.state.showLongterm} 
          sortByUpdatedAsc={this.state.sortByUpdatedAsc} />
      </div>
    );
  }

}


export default CrossingListPage;
