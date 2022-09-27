// import { useLazyQuery } from '@apollo/client';
// import { useEffect, useState } from 'react';
// import { PERMISSIONS } from 'utils/constants';
// import { ActionButton } from 'components/Common/Task/styles';
// import { GET_ORG_ROLES } from 'graphql/queries';
// import { Dialog } from '@mui/material';
// import { CLAIM_ORG_ROLE_BY_DISCORD_ROLE } from 'graphql/mutations';
// import apollo from 'services/apollo';
// import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
// import ChecklistRow from 'components/CheckList/ChecklistRow';
// import {
//   RequestModalBackButton,
//   RequestModalBox,
//   RequestModalButtonBackground,
//   RequestModalCloseIcon,
//   RequestModalExploreRolesAbilityColumns,
//   RequestModalExploreRolesAbilityColumnsTop,
//   RequestModalForwardButton,
//   RequestModalHorizontalAlign,
//   RequestModalRolesAbilityContainer,
//   RequestModalRolesCircle,
//   RequestModalRolesCircleContainer,
//   RequestModalTitle,
//   RequestModalTitleBar,
// } from './styles';

// const ExploreOtherRolesModal = (props) => {
//   const {
//     open,
//     onClose,
//     orgId,
//     notLinkedWalletError,
//     linkedWallet,
//     orgRole,
//     handleOpenCurrentRoleModal,
//     handleOpenExploreOtherRoles,
//     handleOpenJoinRequestModal,
//     handleOpenClaimedRole,
//     handleSetClaimedRole,
//     tokenGatedRoles,
//     claimableDiscordRole,
//   } = props;
//   const [carouselIndex, setCarouselIndex] = useState(0);

//   const useGetOrgRoles = (org) => {
//     const [getOrgRoles, { data }] = useLazyQuery(GET_ORG_ROLES, {
//       fetchPolicy: 'network-only',
//     });
//     useEffect(() => {
//       if (org) {
//         getOrgRoles({
//           variables: {
//             orgId: org,
//           },
//         });
//       }
//     }, [getOrgRoles, org]);
//     return data?.getOrgRoles;
//   };

//   const handleClaimClick = async (role) => {
//     const confirmed = confirm(`Are you sure you want to claim ${role.name}`);
//     if (!confirmed) {
//       return;
//     }
//     if (role.__typename === 'OrgRole') {
//       try {
//         await apollo.mutate({
//           mutation: CLAIM_ORG_ROLE_BY_DISCORD_ROLE,
//           variables: {
//             orgRoleId: role?.id,
//           },
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };

//   const orgRoles = useGetOrgRoles(orgId);

//   const getButtonAction = (role) => {
//     handleSetClaimedRole(role);
//     if (
//       claimableDiscordRole?.find((discordRole) => discordRole.role_id === role?.id) ||
//       tokenGatedRoles?.find((tokenRole) => tokenRole.id === role?.id)
//     ) {
//       handleClaimClick(role);
//       handleOpenExploreOtherRoles(false);
//       handleOpenClaimedRole(true);
//     } else {
//       handleOpenExploreOtherRoles(false);
//       handleOpenJoinRequestModal(true);
//     }
//   };

//   const getButtonTitle = (role) => {
//     if (claimableDiscordRole?.find((discordRole) => discordRole.role_id === role?.id)) {
//       return 'Claim role';
//     }
//     if (orgRole === role?.name) {
//       return 'Current role';
//     }
//     return 'Request role';
//   };

//   const getThreeRolesForCarousel = () => orgRoles?.slice(carouselIndex, carouselIndex + 3);

//   return (
//     <Dialog
//       style={{ width: '100%', display: 'inline-block', flexDirection: 'column', borderRadius: '6px' }}
//       maxWidth="md"
//       fullWidth
//       open={open}
//       onClose={onClose}
//       aria-labelledby="archive-task-modal"
//       aria-describedby="modal-modal-description"
//     >
//       <RequestModalBox
//         style={{
//           height: 'auto',
//         }}
//       >
//         {notLinkedWalletError && (
//           <StyledWarningMessage
//             style={{
//               marginLeft: 0,
//             }}
//           >
//             {`To join via token gated role, switch to linked wallet ${linkedWallet?.slice(0, 7)}...`}
//           </StyledWarningMessage>
//         )}
//         <RequestModalTitleBar>
//           <RequestModalHorizontalAlign>
//             <RequestModalBackButton
//               color="#FFFFFF"
//               onClick={() => {
//                 handleOpenExploreOtherRoles(false);
//                 handleOpenCurrentRoleModal(true);
//               }}
//             />

//             <RequestModalTitle>Roles in Wonderverse</RequestModalTitle>
//           </RequestModalHorizontalAlign>

//           <RequestModalCloseIcon
//             color="#FFFFFF"
//             onClick={() => {
//               onClose();
//             }}
//           />
//         </RequestModalTitleBar>

//         <RequestModalRolesAbilityContainer style={{ alignItems: 'center' }}>
//           {orgRoles?.length >= 3 ? (
//             <RequestModalBackButton
//               color="#FFFFFF"
//               onClick={() => {
//                 if (carouselIndex === 0) {
//                   setCarouselIndex(orgRoles.length - 3);
//                 } else {
//                   setCarouselIndex(carouselIndex - 1);
//                 }
//               }}
//             />
//           ) : null}

//           {getThreeRolesForCarousel()?.map((role) => {
//             const roleCanDo = Object.keys(PERMISSIONS).filter((key) => role?.permissions?.includes(PERMISSIONS[key]));
//             const roleCannotDo = Object.keys(PERMISSIONS).filter(
//               (key) => !role?.permissions?.includes(PERMISSIONS[key])
//             );
//             return (
//               <RequestModalExploreRolesAbilityColumns key={role.name}>
//                 <RequestModalExploreRolesAbilityColumnsTop>
//                   <RequestModalTitle style={{ marginBottom: '12px' }}>{role.name}</RequestModalTitle>
//                   {roleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
//                     ? Object.keys(PERMISSIONS)?.map((permission) => (
//                         <ChecklistRow role={permission} key={permission} status="success" />
//                       ))
//                     : roleCanDo?.map((permission) => (
//                         <ChecklistRow role={permission} key={permission} status="success" />
//                       ))}
//                   {roleCannotDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
//                     ? roleCannotDo?.map((permission) => (
//                         <ChecklistRow role={permission} key={permission} status="fail" />
//                       ))
//                     : null}
//                 </RequestModalExploreRolesAbilityColumnsTop>
//                 <RequestModalButtonBackground>
//                   <ActionButton
//                     disabled={orgRole === role.name}
//                     onClick={() => {
//                       getButtonAction(role);
//                     }}
//                   >
//                     {getButtonTitle(role)}
//                   </ActionButton>
//                 </RequestModalButtonBackground>
//               </RequestModalExploreRolesAbilityColumns>
//             );
//           })}
//           {orgRoles?.length >= 3 ? (
//             <RequestModalForwardButton
//               color="#FFFFFF"
//               onClick={() => {
//                 if (carouselIndex + 3 < orgRoles.length) {
//                   setCarouselIndex(carouselIndex + 1);
//                 } else {
//                   setCarouselIndex(0);
//                 }
//               }}
//             />
//           ) : null}
//         </RequestModalRolesAbilityContainer>
//         <RequestModalRolesCircleContainer>
//           {orgRoles?.map((role, index) => (
//             <RequestModalRolesCircle active={index <= carouselIndex + 2 && index >= carouselIndex} key={role.name} />
//           ))}
//         </RequestModalRolesCircleContainer>
//       </RequestModalBox>
//     </Dialog>
//   );
// };

// export default ExploreOtherRolesModal;
export default {};
