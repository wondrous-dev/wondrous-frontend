import { ChildrenFieldWrapper, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDaoForm/styles';
import { useState } from 'react';
import { ChipWrapper, Divider, StyledChip } from './styles';

const CATEGORIES = [
  '🌎 Social good',
  '🎬 Media & content',
  '🐒 NFT collective',
  '‍‍💰️ Investments',
  '‍💸 Defi',
  '🤝 Social',
  '🔨 Service DAO',
  '‍🤔 Think tank',
  '💀 Fun and memeable',
  '‍🏗️ Building products',
  '‍👀 Something else? Tell us.',
];

const DaoCategory = () => {
  const [selected, setSelected] = useState(null);
  return (
    <ChildrenFieldWrapper>
      <ChipWrapper>
        {CATEGORIES.map((category, index) => (
          <StyledChip
            key={category}
            label={category}
            onClick={() => setSelected(index)}
            selected={selected === index}
          />
        ))}
      </ChipWrapper>
      {selected === CATEGORIES.length - 1 && (
        <>
          <Divider />
          <FieldWrapper>
            <FieldLabel>Enter custom goal</FieldLabel>
            <FieldInput placeholder="What is the org's goal?" />
          </FieldWrapper>
        </>
      )}
    </ChildrenFieldWrapper>
  );
};

export default DaoCategory;
