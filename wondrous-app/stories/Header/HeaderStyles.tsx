import React, { SVGProps } from 'react';
import { AppBar, IconButton, TextField } from '@material-ui/core';
import styled from 'styled-components';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg className="logo" viewBox="0 0 43 31" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M29.818 8.315c-.026.131-.131.236-.288.288a11.29 11.29 0 0 0-7.662 7.636.385.385 0 0 1-.366.287.385.385 0 0 1-.366-.287c-1.072-3.687-3.974-6.59-7.661-7.636-.157-.052-.262-.157-.288-.288h-.026v-.104h.026c.026-.13.13-.236.288-.288 3.687-1.046 6.59-3.948 7.661-7.635A.385.385 0 0 1 21.502 0c.157 0 .314.105.367.288 1.072 3.687 3.974 6.59 7.661 7.635.157.052.262.157.288.288h.026v.104h-.026Z"
      fill="url(#a)"
    />
    <path
      d="M1.317 8.368H1.16c-.314 0-.523.34-.366.601l12.603 21.809c.157.261.55.261.707 0l4.602-8.002c.418-.732.444-1.648.026-2.38A23.565 23.565 0 0 0 1.317 8.368Z"
      fill="url(#b)"
    />
    <path
      d="M41.848 8.368h-.157c-7.531 1.02-13.938 5.622-17.442 12.054-.418.733-.392 1.648.026 2.38l4.629 8.002c.157.261.549.261.706 0L42.214 8.995a.422.422 0 0 0-.366-.627Z"
      fill="url(#c)"
    />
    <defs>
      <linearGradient id="a" x1={36.919} y1={31} x2={36.223} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#CBF" />
        <stop offset={0.474} stopColor="#7427FF" />
        <stop offset={1} stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient id="b" x1={36.919} y1={31} x2={36.223} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#CBF" />
        <stop offset={0.474} stopColor="#7427FF" />
        <stop offset={1} stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient id="c" x1={36.919} y1={31} x2={36.223} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#CBF" />
        <stop offset={0.474} stopColor="#7427FF" />
        <stop offset={1} stopColor="#00BAFF" />
      </linearGradient>
    </defs>
  </svg>
);

export const Headers = styled(AppBar)`
  && {
    height: 70px;
    background: #141414;
    display: flex;
    align-items: center;
    z-index: 200;
    border-bottom: 2px solid rgba(75, 75, 75, 0.5);
  }
`;

export const HeaderContainer = styled.div`
  padding: 15px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`;

export const HeaderHomeButton = styled(IconButton)`
  && {
    background: #363636;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    border: 1px solid deepskyblue;
  }
`;

export const HeaderInput = styled(TextField)({
  '&.MuiTextField-root': {
    width: 310,
    maxWidth: '100%',
    height: 40,
    backgroundColor: '#0F0F0F',
    borderRadius: 6,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  '& .MuiInputBase-input': {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: '0.01em',
    color: '#C4C4C4',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid violet',
  },
});

export const HeaderLeftBlock = styled.div`
  max-width: 440px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLogo = styled(Logo)`
  width: 41px;
  height: 31px;
  :hover {
    cursor: pointer;
  }
`;

export const HeaderRightBlock = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonWonderStyles = styled.div`
  display: flex;
  flex-direction: row;
  width: 165.25px;
  align-items: center;
  padding: 3px;
  border-radius: 98px;
  background: linear-gradient(90deg, rgba(204, 187, 255, 1) 0%, rgba(116, 39, 255, 1) 50%, rgba(0, 186, 255, 1) 100%);
`;

export const ButtonWonder = styled.button`
  display: flex;
  flex-direction: column;
  padding: 6px 22px;
  color: white;
  font-size: 16px;
  background: linear-gradient(180deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%);
  border-radius: 98px;
  border: none;
`;

export const ButtonCreateStyles = styled.div`
  display: flex;
  flex-direction: row;
  width: 105.25px;
  align-items: center;
  padding: 3px;
  border-radius: 98px;
  background: linear-gradient(90deg, rgba(204, 187, 255, 1) 0%, rgba(116, 39, 255, 1) 50%, rgba(0, 186, 255, 1) 100%);
`;

export const ButtonCreate = styled.button`
  display: flex;
  flex-direction: row;
  padding: 6px 16px;
  color: white;
  font-size: 16px;
  background: linear-gradient(180deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%);
  border-radius: 98px;
  border: none;
  align-items: center;
`;

export const ButtonSignInStyles = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  width: 93.25px;
  align-items: center;
  padding: 3px;
  border-radius: 98px;
  background: linear-gradient(90deg, rgba(204, 187, 255, 1) 0%, rgba(116, 39, 255, 1) 50%, rgba(0, 186, 255, 1) 100%);
`;

export const ButtonSignIn = styled.button`
  display: flex;
  flex-direction: column;
  padding: 6px 22px;
  color: white;
  font-size: 16px;
  background: linear-gradient(180deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%);
  border-radius: 98px;
  border: none;
`;

export const HeaderLogoWrapper = styled.button`
  position: relative;
  display: flex;
  border: 0;
  background: transparent;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(20px);
    border-radius: 100%;
    left: 0;
    top: 0;
  }

  &:hover {
    cursor: pointer;
    &::before {
      background: linear-gradient(180deg, #ccbbff 0%, #7427ff 47.4%, #00baff 100%);
    }
  }
`;

export const HeaderHomeButtonWrapper = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(8px);
  }
  &:hover {
    &::before {
      background: linear-gradient(46.92deg, #b820ff 8.72%, #ffffff 115.55%);
    }
  }
`;
