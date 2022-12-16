import React from 'react';

import { withAuth } from 'components/Auth/withAuth';
import Board from 'components/Dashboard/proposals';

const ProposalsPage = () => <Board />;

export default withAuth(ProposalsPage);
