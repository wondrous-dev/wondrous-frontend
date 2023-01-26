import { Error, FieldLabel, FieldWrapper, FieldLabelContainer } from './styles';

type Props = {
  label: string;
  children: React.ReactNode;
  labelWidth?: string | number;
  error?: string;
  labelType?: 'default' | 'highlighted' | string;
};

function TextField({ label, labelType = 'default', labelWidth, error, children }: Props) {
  return (
    <FieldWrapper labelType={labelType}>
      <FieldLabelContainer labelWidth={labelWidth}>
        <FieldLabel>{label}</FieldLabel>
      </FieldLabelContainer>
      <div>
        {children}
        {error ? <Error>{error}</Error> : null}
      </div>
    </FieldWrapper>
  );
}

export default TextField;
