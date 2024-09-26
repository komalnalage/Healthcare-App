import {create} from 'apisauce';
import { config, Mode } from '../../../config';
import getEnvVars from '../../../env';
import AppUtils from '../../utils/appUtils';

const api = create({
  baseURL: getEnvVars().apiUrl,
  timeout: 20000,
  
});

const naviMonitor = response => AppUtils.showLog('Api Response ==> ', response);
config.mode == Mode.DEV && api.addMonitor(naviMonitor);
export default api;
