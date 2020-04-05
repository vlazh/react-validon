import React from 'react';
import { Flex } from 'reflexy';
import { validable, required, minLength, Type } from 'react-validon';
// import { validable, required, minLength, Type } from '../../../../../../dist';
import Input from 'components/Input';

@validable()
export default class App extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    name1: '',
    name2: '',
  };

  updateName1 = (event) => {
    this.setState({ name1: event.target.value });
  };

  updateName2 = (event) => {
    this.setState({ name2: event.target.value });
  };

  validate = () => this.props.validation.validate();

  render() {
    const { validation } = this.props;
    const { name1, name2 } = this.state;

    return (
      <Flex p="xxl" column center>
        <Flex mt column>
          <div>Name1</div>
          <Input
            name="name1"
            prop1="prop1 value"
            autoComplete="off"
            value={name1}
            onChange={this.updateName1}
            validators={[required(), minLength(3, Type.WARN)]}
          />
        </Flex>

        <Flex mt column>
          <div>Name2</div>
          <Input
            name="name2"
            prop1="prop1 value"
            autoComplete="off"
            value={name2}
            onChange={this.updateName2}
            validators={minLength(2)}
          />
        </Flex>

        <Flex mt>Form is valid: {validation.isValid.toString()}</Flex>
        <Flex mt column>
          {Object.entries(validation.result)
            .filter(([, value]) => value.error)
            .map(([name, value]) => (
              <div>
                {name}: {JSON.stringify(value)}
              </div>
            ))}
        </Flex>

        <Flex mt component="button" type="button" onClick={this.validate}>
          Validate all
        </Flex>
      </Flex>
    );
  }
}
