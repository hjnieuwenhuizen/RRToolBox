import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import styles from './styles';

/**
 * AppComponent
 */
class AppComponent extends PureComponent {
	/**
	 * render
	 */
	render() {
		return (
			<div className={this.props.classes.AppComponent}>
				Welcome to RRToolBox boilerplate
			</div>
		)
	}
}

export default injectSheet(styles)(AppComponent);