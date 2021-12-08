import { extend, validate } from "vee-validate";
import {
  required,
  email,
  min,
  confirmed
} from "vee-validate/dist/rules";

extend("required", {...required, message: "This field is required"});
extend('email', { ...email, message: 'Please enter a vaild email' });
extend('min', { ...min, message: 'The password must be at least {length} character' });
extend('confirmed', { ...confirmed, message: 'The password doest not match' });

extend('name', value => {
  if (value.length >= 2) {
    return true;
  }

  return 'This name is too short';
});

extend('password', {
  validate(value, args) {

    if (value.match(/[A-Z]/g) != null)
      return true;
    return 'The password should contain a caps ';

  },
  params: ['length']
})