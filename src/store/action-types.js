import keyBy from 'lodash/keyBy';
import flatMap from 'lodash/flatMap';

export const LOAD_DEVICE_SUMMARY = 'LOAD_DEVICE_SUMMARY';
export const LOAD_ACTIVE_IMAGES = 'LOAD_ACTIVE_IMAGES';
export const LOAD_EDGE_IMAGES = 'LOAD_EDGE_IMAGES';
export const LOAD_EDGE_IMAGE_SETS = 'LOAD_EDGE_IMAGE_SETS';
export const LOAD_EDGE_IMAGE_PACKAGES = 'LOAD_EDGE_IMAGE_PACKAGES';
export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_GROUP_DETAIL = 'LOAD_GROUP_DETAIL';
export const LOAD_TRESHOLD = 'LOAD_TRESHOLD';
export const LOAD_DEVICES_INFO = 'LOAD_DEVICES_INFO';
export const LOAD_CANARIES_INFO = 'LOAD_CANARIES_INFO';
export const LOAD_GROUP_DEVICES_INFO = 'LOAD_GROUP_DEVICES_INFO';
export const LOAD_IMAGE_STATUS = 'LOAD_IMAGE_STATUS';
export const LOAD_IMAGE_DETAIL = 'LOAD_IMAGE_DETAIL';
export const LOAD_IMAGE_SET_DETAIL = 'LOAD_IMAGE_SET_DETAIL';
export const CREATE_NEW_IMAGE = 'CREATE_NEW_IMAGE';
export const CREATE_NEW_IMAGE_RESET = `${CREATE_NEW_IMAGE}_RESET`;
export const POLLING_IMAGES = 'POLLING_IMAGES';
export const LOAD_DEVICE_TABLE = 'LOAD_DEVICE_TABLE';

const asyncActions = flatMap(
  [
    LOAD_EDGE_IMAGES,
    LOAD_EDGE_IMAGE_SETS,
    LOAD_EDGE_IMAGE_PACKAGES,
    LOAD_ACTIVE_IMAGES,
    LOAD_GROUPS,
    LOAD_GROUP_DETAIL,
    LOAD_TRESHOLD,
    LOAD_DEVICES_INFO,
    LOAD_CANARIES_INFO,
    LOAD_GROUP_DEVICES_INFO,
    LOAD_IMAGE_STATUS,
    LOAD_IMAGE_DETAIL,
    LOAD_IMAGE_SET_DETAIL,
    CREATE_NEW_IMAGE,
    LOAD_DEVICE_TABLE,
  ],
  (a) => [a, `${a}_PENDING`, `${a}_FULFILLED`, `${a}_REJECTED`]
);
export const ACTION_TYPES = keyBy(asyncActions, (k) => k);

export const SELECT_ENTITY = 'SELECT_ENTITY';
export const PRE_SELECT_ENTITY = 'PRE_SELECT_ENTITY';
export const CLEAN_ENTITIES = 'CLEAN_ENTITIES';
