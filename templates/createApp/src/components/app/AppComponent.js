import React, { PureComponent } from 'react';

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

export default AppComponent;