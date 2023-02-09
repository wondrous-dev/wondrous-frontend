import { useRouter } from 'next/router';
import { useReducer } from 'react';

export const TYPES = {
  SET_EDIT_TASK: 'EDIT_TASK',
  SET_FULL_SCREEN: 'FULL_SCREEN',
  SET_ACTIVE_TAB: 'ACTIVE_TAB',
  SET_ARCHIVE_TASK: 'ARCHIVE_TASK',
  SET_DELETE_TASK: 'DELETE_TASK',
  SET_INITIAL_STATUS: 'INITIAL_STATUS',
  SET_SHOW_PAYMENT_MODAL: 'SHOW_PAYMENT_MODAL',
  SET_COMPLETE_MODAL: 'COMPLETE_MODAL',
  SET_VIEW_NFT: 'VIEW_NFT',
  SET_FETCHED_TASK: 'FETCHED_TASK',
  SET_APPROVED_SUBMISSION: 'APPROVED_SUBMISSION',
};

const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.SET_EDIT_TASK:
      return { ...state, editTask: action.payload };
    case TYPES.SET_FULL_SCREEN:
      return { ...state, fullScreen: action.payload };
    case TYPES.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case TYPES.SET_ARCHIVE_TASK:
      return { ...state, archiveTask: action.payload };
    case TYPES.SET_DELETE_TASK:
      return { ...state, deleteTask: action.payload };
    case TYPES.SET_INITIAL_STATUS:
      return { ...state, initialStatus: action.payload };
    case TYPES.SET_SHOW_PAYMENT_MODAL:
      return { ...state, showPaymentModal: action.payload };
    case TYPES.SET_COMPLETE_MODAL:
      return { ...state, completeModal: action.payload };
    case TYPES.SET_VIEW_NFT:
      return { ...state, isViewNft: action.payload };
    case TYPES.SET_FETCHED_TASK:
      return { ...state, fetchedTask: action.payload };
    case TYPES.SET_APPROVED_SUBMISSION:
      return { ...state, approvedSubmission: action.payload };
    default:
      return state;
  }
};

export const useTaskViewModalState = () => {
  const router = useRouter();

  const INITIAL_STATE = {
    editTask: false,
    fullScreen: false,
    activeTab: 0,
    archiveTask: false,
    deleteTask: false,
    initialStatus: '',
    showPaymentModal: false,
    completeModal: false,
    isViewNft: !!router?.query?.viewNft,
    approvedSubmission: null,
    fetchedTask: null,
  };

  const [state, dispatchTest] = useReducer(reducer, INITIAL_STATE);

  const dispatch = () => {}

  const setEditTask = (payload) => dispatchTest({ type: TYPES.SET_EDIT_TASK, payload });
  const setFullScreen = (payload) => dispatchTest({ type: TYPES.SET_FULL_SCREEN, payload });
  const setActiveTab = (payload) => dispatchTest({ type: TYPES.SET_ACTIVE_TAB, payload });
  const setArchiveTask = (payload) => dispatchTest({ type: TYPES.SET_ARCHIVE_TASK, payload });
  const setDeleteTask = (payload) => dispatchTest({ type: TYPES.SET_DELETE_TASK, payload });
  const setInitialStatus = (payload) => dispatchTest({ type: TYPES.SET_INITIAL_STATUS, payload });
  const setShowPaymentModal = (payload) => dispatchTest({ type: TYPES.SET_SHOW_PAYMENT_MODAL, payload });
  const setCompleteModal = (payload) => dispatchTest({ type: TYPES.SET_COMPLETE_MODAL, payload });
  const setIsViewNft = (payload) => dispatchTest({ type: TYPES.SET_VIEW_NFT, payload });
  const setFetchedTask = (payload) => dispatchTest({ type: TYPES.SET_FETCHED_TASK, payload });
  const setApprovedSubmission = (payload) => dispatchTest({ type: TYPES.SET_APPROVED_SUBMISSION, payload });
  return {
    ...state,
    setEditTask,
    setFullScreen,
    setActiveTab,
    setArchiveTask,
    setDeleteTask,
    setInitialStatus,
    setShowPaymentModal,
    setCompleteModal,
    setIsViewNft,
    setFetchedTask,
    setApprovedSubmission,
    dispatch,
  };
};
