import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGetCachedClient } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import Checkbox from 'components/shared/Checkbox';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';

const COLS = ['', 'project.name', 'project.createDate', 'project.status'];

export default function Projects () {
  const pageQueries = usePageQueries();
  const [selectedItems, setSelectedItems] = useState<IProject[]>([]);
  const client = useGetCachedClient(pageQueries.id) as IClient;

  const { data: projects = [] } = useGetProjects({ client: client._id });

  return (
    <ListTable columns={COLS} className="projects-table">
      {projects.map((project) => (
        <ListTableRow key={project._id}>
          <ListTableCell>
            <Checkbox
              checked={selectedItems.some((item) => item._id === project._id)}
              onChange={(e) => {
                const { checked } = e.target;
                setSelectedItems((prev) => {
                  if (checked) {
                    return [...prev, project];
                  }
                  return prev.filter((item) => item._id !== project._id);
                });
              }}
            />
          </ListTableCell>
          <ListTableCell>
            <Link to={`/projects?id=${project._id}`} className="table-link" >
              {project.name}
            </Link>
          </ListTableCell>
          <ListTableCell>{getDateFromIso(project.createdAt)}</ListTableCell>
          <ListTableCell>{project.status}</ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};
