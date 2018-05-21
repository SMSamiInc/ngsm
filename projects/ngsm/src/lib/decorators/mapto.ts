const LIST_KEY = '_SMLIST_';

enum PropertyType {
	modelArray,
}

interface IOption {
	key: string;
	mapTo?: string;
	type?: Date | Model | Date[] | Model[] | any;
	handler?: (item: any) => any;
}

function push(target, options: IOption) {
	target[LIST_KEY].push(options);
}

function isObjectDefined(obj) {
	return (obj !== undefined && obj !== null);
}

function getValueByKey(mapTo, key, obj) {
	if (isObjectDefined(obj) && mapTo in obj) {
		return obj[mapTo];
	} else if (isObjectDefined(obj)) {
		return obj[key];
	} else {
		return null;
	}
}

function isDecoratorObject(obj) {
	return isObjectDefined(obj) && typeof obj === 'object' && 'setValues' in obj;
}

function isRawObject(obj) {
	return isObjectDefined(obj) && typeof obj === 'object' && !('setValues' in obj);
}

function copyRawObjectValue(src) {
	const obj = {};
	if (src) {
		const recurseObject = (source, dist) => {
			Object.keys(source).forEach((key) => {
				if (isRawObject(source[key])) {
					dist[key] = {};
					recurseObject(source[key], dist[key]);
				} else {
					dist[key] = source[key];
				}
			});
		};
		recurseObject(src, obj);
		return obj;
	}
	return null;
}

function definesetValues(target) {
	Reflect.defineProperty(target, 'setValues', {
		value: function (json) {
			const self = this;
			this[LIST_KEY].forEach((item: IOption) => {
				if (item.type) {
					if (item.type instanceof Array) {
						let list = getValueByKey(item.mapTo, item.key, json) as any[];
						list = list ? list : [];
						self[item.key] = self[item.key] ? self[item.key] : [];
						self[item.key] = list.map((li) => {
							return new item.type[0].prototype.constructor(li);
						});
					} else if (item.type instanceof Object) {
						const val = getValueByKey(item.mapTo, item.key, json);
						self[item.key] = new item.type.prototype.constructor(val);
					}
				} else if (Array.isArray(self[item.key])) {
					const value = getValueByKey(item.mapTo, item.key, json);
					self[item.key] = isObjectDefined(value) ? value : self[item.key];
				} else if (isRawObject(self[item.key])) {
					self[item.key] = { ...self[item.key], ...copyRawObjectValue(getValueByKey(item.mapTo, item.key, json)) };
				} else {
					const value = getValueByKey(item.mapTo, item.key, json);
					self[item.key] = isObjectDefined(value) ? value : self[item.key];
				}
			});
			return this;
		}
	});
}



function definegetValues(target) {
	Reflect.defineProperty(target, 'getValues', {
		value: function () {
			const self = this;
			const json = {};
			this[LIST_KEY].map((item: IOption) => {
				if (item.mapTo) {
					if (item.type) {
						if (item.type instanceof Array) {
							if (item.handler) {
								json[item.mapTo] = item.handler(self[item.key]);
							} else {
								json[item.mapTo] = (self[item.key] as Model[])
									.map((li: Model) => {
										if (li instanceof Model) {
											return li.getValues();
										} else {
											return li;
										}
									});
							}
						} else if (item.type instanceof Object) {
							if (item.handler) {
								json[item.mapTo] = item.handler(self[item.key]);
							} else if (item.type.prototype instanceof Model) {
								json[item.mapTo] = self[item.key].getValues();
							} else {
								json[item.mapTo] = self[item.key];
							}
						}
					} else if (Array.isArray(self[item.key])) {
						json[item.mapTo] = self[item.key];
					} else if (isRawObject(self[item.key])) {
						json[item.mapTo] = copyRawObjectValue(self[item.key]);
					} else {
						json[item.mapTo] = self[item.key];
					}
				} else if (item.key) {
					if (item.type) {
						if (item.type instanceof Array) {
							if (item.handler) {
								json[item.key] = item.handler(self[item.key]);
							} else {
								json[item.key] = (self[item.key] as Model[])
									.map((li: Model) => {
										if (li instanceof Model) {
											return li.getValues();
										} else {
											return li;
										}
									});
							}
						} else if (item.type instanceof Object) {
							if (item.handler) {
								json[item.key] = item.handler(self[item.key]);
							} else if (item.type.prototype instanceof Model) {
								json[item.key] = self[item.key].getValues();
							} else {
								json[item.key] = self[item.key];
							}
						}
					} else if (Array.isArray(self[item.key])) {
						json[item.key] = self[item.key];
					} else if (isRawObject(self[item.key])) {
						json[item.key] = copyRawObjectValue(self[item.key]);
					} else {
						json[item.key] = self[item.key];
					}
				}
			});
			return json;
		}
	});
}


// MapTo decorator
function MapTo<T>(mapTo = null, type = null, handler: (any) => any = null) {
	return function (target: any, key: string) {
		if (LIST_KEY in target) {
			push(target, { key, mapTo, type, handler });
		} else {
			target[LIST_KEY] = [];
			push(target, { key, mapTo, type, handler });
		}
		definesetValues(target);
		definegetValues(target);
	};
}

export function MapModel(constructor: any) {
	const keys = Object.keys(new constructor());
	keys.forEach((key) => {
		if (LIST_KEY in constructor) {
			push(constructor, { key });
		} else {
			constructor[LIST_KEY] = [];
			push(constructor, { key });
		}
		definesetValues(constructor);
		definegetValues(constructor);
	});
}

@MapModel
class Model<S = any> {

	setValues: (payload: S) => Model;
	getValues: () => S;

	constructor(payload: any = {}) {
		if (this.setValues) { this.setValues(payload); } else {
			this.setValues = (p: S): Model => null;
			this.getValues = (): S => null;
		}
	}

}

export {
	MapTo,
	Model,
};
