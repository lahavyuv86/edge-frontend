import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  Breadcrumb,
  BreadcrumbItem,
  Label,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  InventoryDetailHead,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/Inventory';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deviceDetail } from '../../store/deviceDetail';
import { RegistryContext } from '../../store';
import systemProfileStore from '@redhat-cloud-services/frontend-components-inventory-general-info/redux';
import DeviceDetailTabs from './DeviceDetailTabs';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import { getDeviceHasUpdate } from '../../api/index';

const UpdateDeviceModal = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../Devices/UpdateDeviceModal'
  )
);

const DeviceDetail = () => {
  const { getRegistry } = useContext(RegistryContext);
  const { inventoryId, uuid } = useParams();
  const entity = useSelector(({ entityDetails }) => entityDetails?.entity);
  const groupName = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.name
  );
  const deviceId = useSelector(
    ({ entityDetails }) => entityDetails?.entity?.id
  );

  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
  });
  const [isDeviceStatusLoading, setIsDeviceStatusLoading] = useState(true);
  useEffect(() => {
    insights.chrome.registerModule('inventory');
    insights.chrome?.hideGlobalFilter?.(true);
    insights.chrome.appAction('system-detail');
  }, []);

  useEffect(() => {
    (async () => {
      if (!entity?.display_name) {
        return;
      }
      const image_data = await getDeviceHasUpdate(deviceId);
      setIsDeviceStatusLoading(false);
      setUpdateModal((prevState) => ({
        ...prevState,
        deviceData: {
          display_name: entity.display_name,
          id: entity.id,
          system_profile: {
            image_data,
            status:
              image_data?.UpdateTransactions?.[
                image_data.UpdateTransactions.length - 1
              ]?.Status,
          },
        },
      }));
    })();
  }, [entity]);

  useEffect(() => {
    insights?.chrome?.appObjectId?.(inventoryId);
  }, [inventoryId]);

  return (
    <>
      <DetailWrapper
        hideInvLink
        showTags
        onLoad={({ mergeWithDetail }) => {
          getRegistry().register({
            systemProfileStore,
            ...mergeWithDetail(deviceDetail),
          });
        }}
      >
        <PageHeader>
          <Breadcrumb ouiaId="systems-list">
            <BreadcrumbItem>
              <Link to={uuid ? `/groups` : '/fleet-management'}>
                {uuid ? 'Groups' : 'Fleet management'}
              </Link>
            </BreadcrumbItem>
            {uuid && (
              <BreadcrumbItem>
                {groupName ? (
                  <Link to={`/groups/${uuid}`}>{groupName}</Link>
                ) : (
                  <Skeleton size={SkeletonSize.xs} />
                )}
              </BreadcrumbItem>
            )}
            <BreadcrumbItem isActive>
              <div className="ins-c-inventory__detail--breadcrumb-name">
                {entity?.display_name || <Skeleton size={SkeletonSize.xs} />}
              </div>
            </BreadcrumbItem>
          </Breadcrumb>
          <InventoryDetailHead
            fallback=""
            actions={[
              {
                title: 'Update',
                isDisabled:
                  updateModal.deviceData?.system_profile?.image_data
                    ?.UpdateTransactions?.[
                    updateModal.deviceData?.system_profile?.image_data
                      ?.UpdateTransactions.length - 1
                  ]?.Status === 'BUILDING' ||
                  updateModal.deviceData?.system_profile?.image_data
                    ?.UpdateTransactions?.[
                    updateModal.deviceData?.system_profile?.image_data
                      ?.UpdateTransactions.length - 1
                  ]?.Status === 'CREATED' ||
                  !updateModal.deviceData?.system_profile?.image_data?.ImageInfo
                    ?.UpdatesAvailable?.length > 0,
                onClick: () => {
                  setUpdateModal((prevState) => ({
                    ...prevState,
                    isOpen: true,
                  }));
                },
              },
            ]}
            hideBack
            hideInvDrawer
          />

          {isDeviceStatusLoading ? (
            <Skeleton size={SkeletonSize.xs} />
          ) : updateModal?.deviceData?.system_profile?.status === 'BUILDING' ||
            updateModal?.deviceData?.system_profile?.status === 'CREATED' ? (
            <Label
              className="pf-u-mt-sm"
              color="blue"
              icon={<InProgressIcon />}
            >
              Updating
            </Label>
          ) : updateModal?.deviceData?.system_profile?.image_data?.ImageInfo
              ?.UpdatesAvailable?.length > 0 ? (
            <Label
              className="pf-u-mt-sm"
              color="orange"
              icon={<ExclamationTriangleIcon />}
            >
              Update Available
            </Label>
          ) : (
            <Label
              className="pf-u-mt-sm"
              color="green"
              icon={<CheckCircleIcon color="green" />}
            >
              Running
            </Label>
          )}
        </PageHeader>
        <Main className="edge-c-device--detail">
          <Grid gutter="md">
            <GridItem span={12}>
              <DeviceDetailTabs />
            </GridItem>
          </Grid>
        </Main>
      </DetailWrapper>
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
          />
        </Suspense>
      )}
    </>
  );
};

export default DeviceDetail;
