import { Component } from '@angular/core';
import { Model, MapTo } from 'ngsm';

class User extends Model {

	@MapTo('user_name')
	userName: string;

	constructor(payload: any) {
		super(payload);
	}

}


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor() {

		const user = new User({
			user_name: 'mk',
		});

		console.log(user, user.getValues());


	}

}
