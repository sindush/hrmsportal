import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  EmployeeDetails: {
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticDelete: false,
    },
  },
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
};
