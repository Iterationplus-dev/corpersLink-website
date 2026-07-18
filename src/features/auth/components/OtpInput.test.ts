import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import OtpInput from './OtpInput.vue';

describe('OtpInput', () => {
  it('emits complete with the joined code once every digit box is filled', async () => {
    const wrapper = mount(OtpInput);
    const boxes = wrapper.findAll('.otp-input__box');
    expect(boxes).toHaveLength(4);

    for (const [index, digit] of ['1', '2', '3', '4'].entries()) {
      await boxes[index]?.setValue(digit);
    }

    expect(wrapper.emitted('complete')).toEqual([['1234']]);
  });

  it('does not emit complete while any digit box is still empty', async () => {
    const wrapper = mount(OtpInput);
    const boxes = wrapper.findAll('.otp-input__box');

    await boxes[0]?.setValue('1');
    await boxes[1]?.setValue('2');
    await boxes[2]?.setValue('3');

    expect(wrapper.emitted('complete')).toBeUndefined();
  });
});
