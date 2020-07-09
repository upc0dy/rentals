import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox';
import Modal from 'react-native-modal';
import RangeInput from './RangeInput';
import Button from './Button';

export default class FilterModal extends React.Component {
  state = {
    isVisible: false,
    options: [],
    role: 1,
    errors: new Array(3).fill(null),
  };

  show = (options, role) => {
    const errors = [];
    options.forEach(option => {
      errors.push(
        option.min < 0 || option.max < option.min
          ? 'Minimum limit must be less than maximum limit'
          : null,
      );
    });
    this.setState({ isVisible: true, options, errors, role });
  };

  dismiss = cb =>
    this.setState({ isVisible: false }, () => cb && setTimeout(cb, 500));

  action = () => {
    const { options } = this.state;
    this.dismiss(() => {
      const { action } = this.props;
      action(options);
    });
  };

  updateOption = (text, option, type) => {
    const value = parseInt(text.trim(), 10);
    const newOptions = [...this.state.options];
    newOptions.splice(option.index, 1, {
      ...option,
      [type ? 'min' : 'max']: isNaN(value) ? 0 : value,
    });
    this.setState({ options: newOptions });
  };

  render = () => {
    const { isVisible, options, errors, role } = this.state;
    const radioProps = {
      outerColor: 'dodgerblue',
      filterColor: '#EEE',
      innerColor: 'dodgerblue',
    };
    let disabled = false;
    options.forEach(option => {
      if (disabled) {
        return;
      }
      if (option.filtered && (option.min < 0 || option.max < option.min)) {
        disabled = true;
      }
    });

    return (
      <Modal
        isVisible={isVisible}
        style={styles.modal}
        swipeDirection="down"
        backdropOpacity={0.4}
        onBackdropPress={() => this.dismiss()}
        onSwipeComplete={() => this.dismiss()}
      >
        <View style={[styles.modalContent]}>
          {options.slice(0, 3).map(option => (
            <View key={option.label}>
              <CheckBox
                {...radioProps}
                label={option.label}
                checked={option.filtered}
                styleLabel={styles.label}
                onToggle={checked => {
                  const newOptions = [...options];
                  newOptions.splice(option.index, 1, {
                    ...option,
                    filtered: checked,
                  });
                  this.setState({ options: newOptions });
                }}
              />
              <RangeInput
                value={[`${option.min}`, `${option.max}`]}
                placeholder={['Minimum limit', 'Maximum limit']}
                error={errors[option.index]}
                onChangeText={[
                  text => this.updateOption(text, option, true),
                  text => this.updateOption(text, option, false),
                ]}
                onFocus={_ => {
                  const newErrors = [...errors];
                  newErrors.splice(option.index, 1, null);
                  this.setState({ errors: newErrors });
                }}
                onBlur={_ => {
                  const newErrors = [...errors];
                  newErrors.splice(
                    option.index,
                    1,
                    option.min > option.max
                      ? 'Minimum limit must be less than maximum limit'
                      : null,
                  );
                  this.setState({ errors: newErrors });
                }}
              />
            </View>
          ))}
          {role !== 1 && (
            <CheckBox
              {...radioProps}
              checked={options[3]}
              label="Available Only"
              styleLabel={styles.label}
              labelPosition={LABEL_POSITION.LEFT}
              styleCheckboxContainer={styles.check}
              onToggle={checked =>
                this.setState({
                  options: [...options].map((x, index) =>
                    index === 3 ? checked : x,
                  ),
                })
              }
            />
          )}
          <Button
            outlined
            centered
            disabled={disabled}
            title="Apply Filters"
            action={this.action}
          />
        </View>
      </Modal>
    );
  };
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  check: {
    marginTop: 0,
    marginBottom: 20,
    alignSelf: 'center',
  },
  spacing: { width: 20 },
});
