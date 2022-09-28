import styled from 'styled-components';
import SearchIcon from '/public/images/icons/search.svg';

export const PodPageWrapper = styled.div`
  background-color: #1d1d1d;
  height: 100vh;
  width: 80vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PodPageInnerContainer = styled.div`
  height: 85vh;
  width: 50vw;
  background-color: #1d1d1d;
  /* border: white 1px solid; */
  padding: 0rem 2rem;
`;

export const MainHeading = styled.h1`
  color: #fff;
  font-size: 2rem;
`;

export const TabsOptionContainer = styled.div`
  display: flex;
  margin-left: -1rem;
  margin-bottom: 2rem;
`;

export const SearchBarContainer = styled.div`
  width: 100%;
  height: 4rem;
  background-color: #141414;
  display: flex;
  align-items: center;
`;

export const SearchBarIcon = styled(SearchIcon)`
  height: 1.5rem;
  margin-left: 1rem;
`;

export const SearchInput = styled.input`
  margin-left: 0.5rem;
  font-size: 1.3rem;
  font-weight: 400;
  color: #fff;
  background-color: transparent;
  border: none;
  outline: none;
`;

export const TabsOption = styled.h1`
  color: #828282;
  margin-right: 2rem;
  font-weight: 400;
  padding: 1rem 1.5rem;

  ${({ active }) =>
    active &&
    `
        color: #fff;
        border-bottom: #fff 5px solid;
        font-weight: 500;
    `}
`;

export const TabContainer = styled.div`
  display: flex;
`;

export const ShowALlTab = styled.div`
  width: 100%;
  display: none;
  ${({ active }) =>
    active &&
    `
        display: flex;
        flex-direction: column;
        align-items: center;
    `}
`;
export const PodsIamInTab = styled.div`
  display: none;
  ${({ active }) =>
    active &&
    `
        display: flex;
    `}
`;
export const PodsIamNotInTab = styled.div`
  display: none;
  ${({ active }) =>
    active &&
    `
        display: flex;
    `}
`;

export const CreateNewPodButton = styled.button`
  width: 13rem;
  height: 3rem;
  background-color: #313131;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
`

export const CreateNewPodContainer = styled.div`
  background-color: #232323;
  margin-top: 1.2rem;
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CreatePodModalContainer = styled.div`
  /* margin-left: 5rem; */
  position: absolute;

`