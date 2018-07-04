import React, { Component } from 'react';
import { connect } from 'react-redux';
import ComponentName from './ComponentName';

/**
 * ContainerName
 */
class ContainerName extends Component {
	/**
	 * render
	 */
	render() {
		return (
            <ComponentName/>
        )
	}
}

/**
 * mapStateToProps
 */
const mapStateToProps = (state) => {
    return {}
}

/**
 * mapDispatchToProps
 */
const mapDispatchToProps = (dispatch) => {
    return {}
}

// Export component and connect actions and state
export default connect(mapStateToProps, mapDispatchToProps)(ContainerName);