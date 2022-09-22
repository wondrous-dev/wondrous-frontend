import styled from 'styled-components';
import AddIcon from 'components/Icons/add.svg';

const styles = {
  categoryButton: {
    cursor: 'pointer',
    height: 34,
    width: 34,
    borderRadius: 20,
    background: '#363636',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-17px',
  },
  categoryButtonContainer: {
    width: '100%',
    borderTop: '1px solid #363636;',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6.5,
    marginBottom: 6.5,
  },
  topButtonsContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' },
  addCategoryButton: {
    padding: '14px',
    color: 'white',
    background: '#1D1D1B',
    borderRadius: '6px',
    ':hover': { background: '#353434' },
  },
  addIcon: {
    marginRight: '8px',
  },
};

export default styles;

export const AddIconWrapper = styled((props) => (
  <div {...props}>
    <div>
      <AddIcon />
    </div>
  </div>
))`
  align-items: center;
  background: ${({ theme }) =>
    `linear-gradient(270deg, ${theme.palette.highlightBlue} -5.62%, ${theme.palette.highlightPurple} 45.92%, ${theme.palette.blue20} 103.12%)`};
  display: flex;
  height: 22px;
  justify-content: center;
  width: 22px;
  border-radius: 50px;
  > div {
    border-radius: 50px;
    align-items: center;
    background: ${({ theme }) => theme.palette.background.default};
    display: flex;
    height: 20px;
    justify-content: center;
    width: 20px;
  }
`;
