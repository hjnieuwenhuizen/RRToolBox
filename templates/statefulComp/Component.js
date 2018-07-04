import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import styles from './styles';

/**
 * ComponentName
 */
class ComponentName extends PureComponent {
	/**
	 * render
	 */
	render() {
		return (
			<div className={this.props.classes.ComponentName}>

			</div>
		)
	}
}

export default injectSheet(styles)(ComponentName);