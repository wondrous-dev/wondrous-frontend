import React, { useEffect } from 'react';
import {
  CreateFormPreviewButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateModalOverlay,
} from 'components/CreateEntity/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import { ModalBody } from 'components/Common/KanbanBoard/styles';
import { useMe } from 'components/Auth/withAuth';

const HelpModal = (props) => {
  const { handleClose, setEntityType, open } = props;
  const user = useMe();
  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          (e.type = 'text/javascript'),
            (e.async = !0),
            (e.src = 'https://canny.io/sdk.js'),
            f.parentNode.insertBefore(e, f);
        }
      }
      if ('function' != typeof w.Canny) {
        var c = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          'complete' === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent('onload', l)
            : w.addEventListener('load', l, !1);
      }
    })(window, document, 'canny-jssdk', 'script');
    if (user) {
      Canny('identify', {
        appID: '62955abecab11f0b7619ff3f',
        user: {
          // Replace these values with the current user's data
          email: user && user.userInfo && user.userInfo.email ? user.userInfo.email : 'no@email.com',
          name: user.username,
          id: user.id,
        },
      });
    }
  }, [user]);

  return (
    <CreateModalOverlay open={open} onClose={handleClose}>
      <ModalBody>
        <CreateLayoutsModalHeader></CreateLayoutsModalHeader>
        <CreateLayoutsModalItemContainer>
          <CreateLayoutsModalItemTitle>
            Would you like to go check our tutorials or go to our support team?
          </CreateLayoutsModalItemTitle>
          <div
            style={{
              display: 'flex',
            }}
          >
            <CreateFormPreviewButton
              href="https://wonderverse.gitbook.io/welcome-to-wonderverse/why-wonder/how-we-help-web3-organizations"
              style={{
                marginTop: '24px',
              }}
              target="_blank"
            >
              Tutorials
            </CreateFormPreviewButton>
            <CreateFormPreviewButton
              href="https://wonderverse.canny.io/productfeedback"
              style={{
                marginTop: '24px',
              }}
              target="_blank"
            >
              Add feedback/support ticket
            </CreateFormPreviewButton>
          </div>
        </CreateLayoutsModalItemContainer>
      </ModalBody>
    </CreateModalOverlay>
  );
};

export default HelpModal;
