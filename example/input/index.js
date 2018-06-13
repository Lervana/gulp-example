import _ from 'lodash';

const example = { name: 'example' };

console.log('Hello in gulp example');
console.log(_.get(example, 'name'));
console.log(_.get(example, 'not_existing_field'));
