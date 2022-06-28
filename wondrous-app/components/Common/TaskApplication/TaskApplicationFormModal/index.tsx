import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
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
  TaskApplicationFormModalBody,
  IconWrapper,
} from './styles';
import isUrl from 'is-url';
import { RejectButton } from '../ApplicationList/styles';
import { ActionButton } from 'components/Common/Task/styles';
import { ConfirmationModalFooter } from '../styles';
import PlusIcon from 'components/Icons/plus';
import RedXIcon from 'components/Icons/redx';

const TEXT_AREA_LIMIT = 380;

const LINK_KEYS = {
  URL: 'url',
  DISPLAY_NAME: 'displayName',
};

const EMPTY_LINK_FIELD = { [LINK_KEYS.URL]: '', [LINK_KEYS.DISPLAY_NAME]: '' };

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
  const fields = value || props.defaultValue;
  const [errors, setErrors] = useState([]);

  const addField = (idx) => {
    return onChange([...fields, EMPTY_LINK_FIELD]);
  };

  const removeField = (idx) => {
    const newFields = fields.filter((field, i) => i !== idx);
    onChange(newFields);
  };

  const handleInputChange = (value, idx, type) => {
    if (props.value && props.value[idx]) {
      const newFields = props.value.map((item, index) => {
        if (index === idx) {
          return { ...item, [type]: value };
        }
        return item;
      });
      return onChange(newFields);
    }
    const newFields = [{ [type]: value }];
    return onChange(newFields);
  };

  const handleField = (e, idx) => {
    e.preventDefault();
    const action = idx !== fields?.length - 1 ? removeField : addField;
    action(idx);
  };

  const validateUrl = (e, idx) => {
    const value = e.target.value;
    const isValidUrl = isUrl(value);
    const errorExists = !!errors[idx];
    const newErrors = [...errors];

    if (!isValidUrl && !errorExists) {
      newErrors[idx] = 'Please enter valid URL';
      return setErrors(newErrors);
    }
    if (isValidUrl && errorExists) {
      const newErrors = [...errors];
      newErrors[idx] = null;
      return setErrors(newErrors);
    }
  };

  return (
    <LinksWrapper>
      {fields.map((field, idx) => {
        return (
          <LinkContainer key={idx}>
            <div style={{ width: '20%' }}>
              <LinkTitleInput
                placeholder={'Title of link'}
                value={field[LINK_KEYS.DISPLAY_NAME]}
                onChange={(e) => handleInputChange(e.target.value, idx, LINK_KEYS.DISPLAY_NAME)}
                required
              />
              <span />
            </div>
            <div style={{ flex: 1 }}>
              <LinkUrlInput
                placeholder={'URL link'}
                value={field[LINK_KEYS.URL]}
                onBlur={(e) => validateUrl(e, idx)}
                onChange={(e) => handleInputChange(e.target.value, idx, LINK_KEYS.URL)}
                error={!!errors[idx]}
                required
                type="url"
              />
            </div>
            <IconWrapper type="button" onClick={(e) => handleField(e, idx)}>
              {idx !== fields.length - 1 ? <RedXIcon strokeWidth={1} stroke={'#7A7A7A'} /> : <PlusIcon />}
            </IconWrapper>
          </LinkContainer>
        );
      })}
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
  const { open, onClose, handleSubmit, taskId } = props;

  const initialValues = { message: null, links: null };

  const formValidationSchema = yup.object().shape({
    message: yup.string().required('Sending a message is required'),
    links: yup
      .array()
      .of(yup.object({ displayName: yup.string().required(), url: yup.string().url().required() }))
      .optional(),
  });
  const form = useFormik({
    initialValues,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validationSchema: formValidationSchema,
  });

  const onChange = (key, value) => {
    form.setFieldValue(key, value);
  };

  return (
    <TaskApplicationFormModal open={open}>
      <TaskApplicationForm onSubmit={form.handleSubmit}>
        <TaskApplicationFormBorder>
          <TaskApplicationFormBackground>
            <TaskApplicationFormHeader>
              <TaskApplicationFormHeaderText>Apply to this task</TaskApplicationFormHeaderText>
              <TaskApplicationFormHeaderCloseButton onClick={onClose} />
            </TaskApplicationFormHeader>
            <TaskApplicationFormModalBody>
              {config.map((field, idx) => {
                const Component = COMPONENTS_MAP[field.type];
                const value = form.values[field.key];
                return (
                  <div key={idx}>
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
            </TaskApplicationFormModalBody>

            <ConfirmationModalFooter>
              <RejectButton
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </RejectButton>
              <ActionButton type="submit">Apply</ActionButton>
            </ConfirmationModalFooter>
          </TaskApplicationFormBackground>
        </TaskApplicationFormBorder>
      </TaskApplicationForm>
    </TaskApplicationFormModal>
  );
}
