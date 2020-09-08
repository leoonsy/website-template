import { ITest } from './ITest';
const test: ITest = {
  message: 'Works!',
};
export default () => {
  console.log(test.message);
};
