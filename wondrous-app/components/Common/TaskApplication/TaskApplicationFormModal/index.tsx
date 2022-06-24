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
} from './styles';

const TEXT_AREA_LIMIT = 380;

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
  },
];

const LinksComponent = () => <div>null</div>;

const TextArea = (props) => {
  console.log(props);
  const { value } = props;
  return (
    <>
      <TaskApplicationFormTextarea {...props} />
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
                <Component
                  {...field}
                  value={value}
                  key={idx}
                  onChange={(e) => {
                    onChange(field.key, e.target.value);
                  }}
                />
              );
            })}
          </TaskApplicationFormBackground>
        </TaskApplicationFormBorder>
      </TaskApplicationForm>
    </TaskApplicationFormModal>
  );
}
