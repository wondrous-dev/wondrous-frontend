import { useState, useContext } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';
import {
  TaskApplicationForm,
  TaskApplicationFormModal,
  TaskApplicationFormBorder,
  TaskApplicationFormTextarea,
  TaskApplicationFormBackground,
  TaskApplicationFormHeader,
  TaskApplicationFormHeaderText,
  TaskApplicationFormHeaderCloseButton,
  TaskApplicationTextAreaCount,
  LinksWrapper,
  LinkContainer,
  LinkTitleInput,
  LinkUrlInput,
} from './styles';

const TEXT_AREA_LIMIT = 380;

const EMPTY_LINK_FIELD = { '': '' };
const config = [
  {
    type: 'textarea',
    placeholder: 'Include a note to admin...',
    required: true,
    key: 'message',
    value: null,
    maxLength: TEXT_AREA_LIMIT,
  },
  {
    type: 'links',
    value: null,
    key: 'links',
    defaultValue: [EMPTY_LINK_FIELD],
  },
];

const LinksComponent = (props) => {
  const { value, defaultValue, onChange } = props;
  const fields = props.value || props.defaultValue;

  const addField = (idx) => {
    return onChange([...fields, EMPTY_LINK_FIELD]);
  };

  const removeField = (idx) => {
    const newFields = fields.filter((field, i) => i === idx);
    onChange(newFields);
  };

  const onTitleChange = (value, idx) => {
    if (props.value && props.value[idx]) {
      const newFields = [...props.value];
      const existingValue = Object.values(newFields[idx])[0];
      newFields[idx] = { [value]: existingValue };
      return onChange(newFields);
    }
    const newFields = [{ [value]: '' }];
    return onChange(newFields);
  };

  const onUrlChange = (value, idx) => {
    if (props.value && props.value[idx]) {
      const newFields = [...props.value];
      const existingTitle = Object.keys(newFields[idx])[0];
      newFields[idx] = { [existingTitle]: value };
      return onChange(newFields);
    }
    const newFields = [{ '': value }];
    return onChange(newFields);
  };

  const handleField = (e, idx) => {
    e.preventDefault();
    const action = fields[idx] && fields[idx] !== fields[fields.length - 1] ? removeField : addField;
    action(idx);
  };
  return (
    <LinksWrapper>
      {fields.map((field, idx) => (
        <LinkContainer key={idx}>
          <LinkTitleInput placeholder={'Title of link'} onChange={(e) => onTitleChange(e.target.value, idx)} />
          <LinkUrlInput placeholder={'URL link'} onChange={(e) => onUrlChange(e.target.value, idx)} />
          <button type="button" onClick={(e) => handleField(e, idx)}>
            {fields[idx] && fields[idx] !== fields[fields.length - 1] ? 'remove' : 'add'}
          </button>
        </LinkContainer>
      ))}
    </LinksWrapper>
  );
};

const TextArea = (props) => {
  const { value, onChange } = props;
  return (
    <>
      <TaskApplicationFormTextarea {...props} onChange={(e) => onChange(e.target.value)} />
      <TaskApplicationTextAreaCount>
        {value?.length || 0}/{TEXT_AREA_LIMIT} characters
      </TaskApplicationTextAreaCount>
    </>
  );
};

const COMPONENTS_MAP = {
  textarea: TextArea,
  links: LinksComponent,
};

export default function TaskApplicationModal(props) {
  const { open, onClose, handleSubmit } = props;
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);

  const initialValues = { message: null, links: null };

  const form = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values, 'values in form modal');
    },
  });

  const onChange = (key, value) => form.setFieldValue(key, value);
  return (
    <TaskApplicationFormModal open={open}>
      <TaskApplicationForm onSubmit={form.handleSubmit}>
        <TaskApplicationFormBorder>
          <TaskApplicationFormBackground>
            <TaskApplicationFormHeader>
              <TaskApplicationFormHeaderText>Apply to this task</TaskApplicationFormHeaderText>
              <TaskApplicationFormHeaderCloseButton onClick={onClose} />
            </TaskApplicationFormHeader>

            {config.map((field, idx) => {
              const Component = COMPONENTS_MAP[field.type];
              const value = form.values[field.key];
              return (
                <div>
                  <Component
                    {...field}
                    value={value}
                    key={idx}
                    onChange={(value) => {
                      onChange(field.key, value);
                    }}
                  />
                </div>
              );
            })}
          </TaskApplicationFormBackground>
        </TaskApplicationFormBorder>
      </TaskApplicationForm>
    </TaskApplicationFormModal>
  );
}
