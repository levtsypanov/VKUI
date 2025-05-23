import * as React from 'react';
import { ComponentPlayground, type ComponentPlaygroundProps } from '@vkui-e2e/playground-helpers';
import { withLabel } from '@vkui-e2e/utils';
import { Cell } from '../Cell/Cell';
import { CellButton } from '../CellButton/CellButton';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Radio } from '../Radio/Radio';
import { RichCell } from '../RichCell/RichCell';
import { SimpleCell } from '../SimpleCell/SimpleCell';
import { FormItem, type FormItemProps } from './FormItem';

export const FormItemPlayground = (props: ComponentPlaygroundProps) => {
  return (
    <ComponentPlayground
      {...props}
      propSets={[
        {
          top: [undefined, 'Сверху'],
          bottom: [undefined, 'Снизу'],
          removable: [undefined, true],
          children: [
            <Input key={0} aria-labelledby="bottom-id" placeholder="Введите ваше значение" />,
          ],
          bottomId: ['bottom-id'],
        },
        {
          top: [
            withLabel(
              'Сверху будет находиться достаточно длинное название текста с очень большим количеством однотипных слов для переполнения текста',
              'Long top text',
            ),
          ],
          topMultiline: [undefined, true],
          children: [<Input key={0} placeholder="Введите ваше значение" />],
        },
        {
          children: [
            <CellButton key="cellbtn">CellButton</CellButton>,
            <Checkbox key="checkbox">Checkbox</Checkbox>,
            <Radio key="radio">Radio</Radio>,
            <RichCell key="rcell">RichCell</RichCell>,
            <SimpleCell key="scell">SimpleCell</SimpleCell>,
            <Cell draggable key="drag">
              Cell draggable
            </Cell>,
            <Cell draggable mode="removable" key="dragrem">
              Cell draggable removable
            </Cell>,
            <Cell draggable mode="selectable" key="dragsel">
              Cell draggable selectable
            </Cell>,
            <Cell mode="removable" key="rem">
              Cell removable
            </Cell>,
            <Cell mode="selectable" key="sel">
              Cell selectable
            </Cell>,
          ],
        },
        {
          top: ['Сверху'],
          bottom: ['Снизу'],
          bottomId: ['bottom-id'],
          removable: ['indent'],
          children: [
            <Input key={0} aria-labelledby="bottom-id" placeholder="Введите ваше значение" />,
          ],
        },
        {
          top: ['Сверху'],
          children: [<Input key={0} placeholder="Введите ваше значение" />],
          required: [true],
        },
        {
          noPadding: [true],
          removable: [undefined, true],
          children: [<Input key={0} placeholder="Введите ваше значение" />],
        },
      ]}
    >
      {(props: FormItemProps) => (
        <FormItem {...props} style={{ maxWidth: '300px', boxSizing: 'content-box' }} />
      )}
    </ComponentPlayground>
  );
};

interface FormItemTopAsideProps extends FormItemProps {
  topLabel?: React.ReactNode;
  topAside?: React.ReactNode;
}

export const FormItemTopAsidePlayground = (props: ComponentPlaygroundProps) => {
  return (
    <ComponentPlayground
      {...props}
      propSets={[
        {
          topLabel: [
            <FormItem.TopLabel key="1">
              Дополнительная информация с достаточно длинным описанием
            </FormItem.TopLabel>,
            undefined,
          ],
          topAside: [
            <FormItem.TopAside key="0">0/100</FormItem.TopAside>,
            <FormItem.TopAside key="1">Контент сбоку имеет приоритет</FormItem.TopAside>,
          ],
          children: [<Input key={0} placeholder="Введите ваше значение" />],
        },
        {
          topMultiline: [true],
          topLabel: [
            <FormItem.TopLabel key="0">
              Дополнительная информация с достаточно длинным описанием
            </FormItem.TopLabel>,
          ],
          topAside: [<FormItem.TopAside key="0">0/100</FormItem.TopAside>],
          children: [<Input key={0} placeholder="Введите ваше значение" />],
        },
      ]}
    >
      {({ topLabel, topAside, ...props }: FormItemTopAsideProps) => (
        <FormItem
          {...props}
          top={
            <FormItem.Top>
              {topLabel}
              {topAside}
            </FormItem.Top>
          }
          style={{ maxWidth: '300px', boxSizing: 'content-box' }}
        />
      )}
    </ComponentPlayground>
  );
};
