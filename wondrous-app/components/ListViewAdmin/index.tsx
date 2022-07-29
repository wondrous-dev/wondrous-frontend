import Accordion from 'components/Common/ListViewAccordion';
import ColumnEntry from './ColumnEntry';
import { ADMIN_COLUMNS_TYPES } from 'utils/constants';

interface ColumnItem {
  type: string;
  items: Array<any>;
  hasMore: boolean;
}

interface Props {
  columns: ColumnItem[];
  onLoadMore: () => any;
}

function ListViewAdmin({ columns, onLoadMore }: Props) {
  console.log(columns);
  return (
    <>
      {columns.map((column, colIdx) => {
        const title = ADMIN_COLUMNS_TYPES[column.type];

        if (!column) return null;
        return (
          <Accordion
            isExpanded={column?.items?.length > 0}
            key={colIdx}
            title={title}
            count={10}
            headerAddons={null}
            displayShowMore={column.hasMore}
            onShowMore={onLoadMore}
          >
            {column?.items.map((item, idx) => (
              <ColumnEntry
                key={idx}
                type={column.type}
                userProfilePicture={item.userProfilePicture}
                orgUsername={item.orgUsername}
                orgProfilePicture={item.orgProfilePicture}
                podColor={item.podColor}
                podId={item.podId}
                podName={item.podName}
                userId={item.userId}
                userUsername={item.userUsername}
                id={item.id}
                creatorProfilePicture={item.creatorProfilePicture}
                creatorUsername={item.creatorUsername}
                description={item.description}
                message={item.message}
                title={item.title}
                commentCount={item.commentCount}
                taskId={item.taskId}
              />
            ))}
          </Accordion>
        );
      })}
    </>
  );
}

export default ListViewAdmin;
