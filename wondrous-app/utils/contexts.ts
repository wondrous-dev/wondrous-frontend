import React, { createContext } from 'react';

export const IsMobileContext = createContext(false);

export const SideBarContext = createContext(null);

export const TextInputContext = createContext(null);

export const OrgBoardContext = createContext(null);

export const UserBoardContext = createContext(null);

export const PodBoardContext = createContext(null);

export const SettingsBoardContext = createContext(null);

export const ColumnsContext = createContext(null);

export const ApprovedSubmissionContext = createContext(null); // for payment probably hacky

export const PaymentModalContext = createContext(null);

export const SelectMembershipContext = createContext(null);

export const TokenGatingContext = createContext(null);

export const UserProfileContext = createContext(null);

export const GlobalContext = createContext(null);

export const HotkeyContext = createContext(null);
