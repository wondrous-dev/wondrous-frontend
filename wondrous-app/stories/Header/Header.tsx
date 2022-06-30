import React from 'react';
import { InputAdornment } from '@material-ui/core';
import {
  Headers,
  HeaderContainer,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderHomeButton,
  HeaderInput,
  HeaderRightBlock,
  ButtonWonderStyles,
  ButtonWonder,
  ButtonCreateStyles,
  ButtonCreate,
  ButtonSignInStyles,
  ButtonSignIn,
  HeaderLogoWrapper,
  HeaderHomeButtonWrapper,
} from './HeaderStyles';
import { HomeIcon, SearchIcon, CreateBtnIcon } from './icons';

export const Header = (props) => {
  const { onClick } = props;

  return (
    <Headers>
      <HeaderContainer>
        <HeaderLeftBlock>
          <div title="Explore page">
            <HeaderLogoWrapper>
              <div onClick={onClick}>
                <HeaderLogo />
              </div>
            </HeaderLogoWrapper>
          </div>
          <div title="Dashboard">
            <HeaderHomeButtonWrapper>
              <HeaderHomeButton>
                <HomeIcon />
              </HeaderHomeButton>
            </HeaderHomeButtonWrapper>
          </div>

          <HeaderInput
            placeholder="Search wonder..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{
              visibility: 'hidden',
            }}
          />
        </HeaderLeftBlock>
        <HeaderRightBlock>
          <a
            style={{
              textDecoration: 'none',
              paddingRight: '10px',
            }}
            href="https://linktr.ee/wonderverse"
            target="_blank"
            rel="noreferrer"
          >
            <ButtonWonderStyles>
              <ButtonWonder onClick={onClick}>Wonder Tutorials</ButtonWonder>
            </ButtonWonderStyles>
          </a>
          <>
            <ButtonCreateStyles>
              <ButtonCreate onClick={onClick}>
                Create
                <CreateBtnIcon style={{ paddingLeft: '8px' }} />
              </ButtonCreate>
            </ButtonCreateStyles>
          </>
          <ButtonSignInStyles>
            <ButtonSignIn onClick={onClick}>Sign in</ButtonSignIn>
          </ButtonSignInStyles>
        </HeaderRightBlock>
      </HeaderContainer>
    </Headers>
  );
};
