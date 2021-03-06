/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var App = require('app');

/**
 * Config for each ajax-request
 *
 * Fields example:
 *  mock - testMode url
 *  real - real url (without API prefix)
 *  type - request type (also may be defined in the format method)
 *  format - function for processing ajax params after default formatRequest. May be called with one or two parameters (data, opt). Return ajax-params object
 *  testInProduction - can this request be executed on production tests (used only in tests)
 *
 * @type {Object}
 */
var urls = {

  'common.cluster.update' : {
    'type': 'PUT',
    'real': '/clusters/{clusterName}',
    'mock': '/data/wizard/deploy/poll_1.json',
    'format': function (data) {
      return {
        data: JSON.stringify(data.data)
      };
    }
  },

  'common.services.update' : {
    'real': '/clusters/{clusterName}/services?{urlParams}',
    'mock': '/data/wizard/deploy/poll_1.json',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context,
            "operation_level": {
              "level": "CLUSTER",
              "cluster_name" : data.clusterName
            }
          },
          Body: {
            ServiceInfo: data.ServiceInfo
          }
        })
      };
    }
  },

  'common.service.update' : {
    'real': '/clusters/{clusterName}/services/{serviceName}',
    'mock': '/data/wizard/deploy/poll_1.json',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context,
            "operation_level": {
              "level": "SERVICE",
              "cluster_name" : data.clusterName,
              "service_name" : data.serviceName
            }
          },
          Body: {
            ServiceInfo: data.ServiceInfo
          }
        })
      };
    }
  },

  'common.service_component.info' : {
    'real': '/clusters/{clusterName}/services/{serviceName}/components/{componentName}?{urlParams}',
    'mock': '/data/wizard/deploy/poll_1.json'
  },

  'common.host_component.update': {
    'real': '/clusters/{clusterName}/host_components',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          RequestInfo: {
            context: data.context,
            query: data.query
          },
          Body: {
            "HostRoles": data.HostRoles
          }
        })
      }
    }
  },

  'common.host.host_components.update': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components?{urlParams}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context,
            "operation_level": {
              level: "HOST",
              cluster_name: data.clusterName,
              host_names: data.hostName
            },
            query: data.query
          },
          Body: {
            "HostRoles": data.HostRoles
          }
        })
      }
    }
  },

  'common.host.host_component.update': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}?{urlParams}',
    'mock': '/data/wizard/deploy/2_hosts/poll_9.json',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context,
            "operation_level": {
              level: "HOST_COMPONENT",
              cluster_name: data.clusterName,
              host_name: data.hostName,
              service_name: data.serviceName || null
            }
          },
          Body: {
            "HostRoles": data.HostRoles
          }
        })
      }
    }
  },

  'common.service.configurations': {
    'real':'/clusters/{clusterName}',
    'mock':'',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          Clusters: {
            desired_config: data.desired_config
          }
        })
      }
    }
  },

  'common.across.services.configurations': {
    'type': 'PUT',
    'real':'/clusters/{clusterName}',
    'mock':'/data/services/ambari.json',
    'format': function(data) {
      return {
        dataType: 'text',
        data: data.data
      }
    }
  },

  'common.request.polling': {
    'real': '/clusters/{clusterName}/requests/{requestId}?fields=tasks/Tasks/request_id,tasks/Tasks/command,tasks/Tasks/command_detail,tasks/Tasks/start_time,tasks/Tasks/end_time,tasks/Tasks/exit_code,tasks/Tasks/host_name,tasks/Tasks/id,tasks/Tasks/role,tasks/Tasks/status,tasks/Tasks/structured_out,Requests/*&tasks/Tasks/stage_id={stageId}',
    'mock': '/data/background_operations/host_upgrade_tasks.json'
  },

  'service.ambari': {
    'real': '/services/AMBARI?fields=components/RootServiceComponents',
    'mock': '/data/services/ambari.json'
  },

  'service.flume.agent.command': {
    'real': '/clusters/{clusterName}/hosts/{host}/host_components/FLUME_HANDLER',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          "RequestInfo": {
            "context": data.context,
            "flume_handler": data.agentName,
            "operation_level": {
              level: "HOST_COMPONENT",
              cluster_name: data.clusterName,
              service_name: "FLUME",
              host_name: data.host
            }
          },
          "Body": {
            "HostRoles": {
              "state": data.state
            }
          }
        })
      }
    }
  },

  'common.host_components.update': {
    'real': '/clusters/{clusterName}/host_components?{urlParams}',
    'mock': '/data/wizard/deploy/poll_1.json',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context,
            "operation_level": {
              level: data.level || "CLUSTER",
              cluster_name: data.clusterName
            },
            query: data.query
          },
          Body: {
            "HostRoles": data.HostRoles
          }
        })
      }
    }
  },

  'common.service.passive': {
    'real': '/clusters/{clusterName}/services/{serviceName}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            "context": data.requestInfo
          },
          Body: {
            ServiceInfo: {
              maintenance_state: data.passive_state
            }
          }
        })
      };
    }
  },

  'common.host.host_component.passive': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          RequestInfo: {
            "context": data.context
          },
          Body: {
            HostRoles: {
              maintenance_state: data.passive_state
            }
          }
        })
      };
    }
  },

  'common.host.with_host_component': {
    'real': '/clusters/{clusterName}/hosts?host_components/HostRoles/component_name={componentName}&minimal_response=true',
    'mock': ''
  },

  'common.delete.host': {
    'real': '/clusters/{clusterName}/hosts/{hostName}',
    'type': 'DELETE'
  },
  'common.delete.host_component': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}',
    'type': 'DELETE'
  },
  'common.delete.user': {
    'real': '/users/{user}',
    'type': 'DELETE'
  },
  'common.delete.config_group': {
    'real': '/clusters/{clusterName}/config_groups/{id}',
    'type': 'DELETE'
  },
  'common.delete.cluster': {
    'real': '/clusters/{name}',
    'type': 'DELETE'
  },
  'common.delete.service': {
    'real': '/clusters/{clusterName}/services/{serviceName}',
    'mock': '/data/services/ambari.json',
    'type': 'DELETE'
  },
  'common.delete.request_schedule': {
    'real': '/clusters/{clusterName}/request_schedules/{request_schedule_id}',
    'type': 'DELETE'
  },
  'alerts.load_alert_groups': {
    'real': '/clusters/{clusterName}/alert_groups?fields=*',
    'mock': 'data/alerts/alertGroups.json'
  },
  'alerts.load_an_alert_group': {
    'real': '/clusters/{clusterName}/alert_groups/{group_id}',
    'mock': 'data/alerts/alertGroup.json'
  },
  'alert_groups.create': {
    'real': '/clusters/{clusterName}/alert_groups',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "AlertGroup": {
            "name": data.name,
            "definitions": data.definitions,
            "targets": data.targets
          }
        })
      };
    }
  },
  'alert_groups.update': {
    'real': '/clusters/{clusterName}/alert_groups/{group_id}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          "AlertGroup": {
            "name": data.name,
            "definitions": data.definitions,
            "targets": data.targets
          }
        })
      };
    }
  },
  'alert_groups.delete': {
    'real': '/clusters/{clusterName}/alert_groups/{group_id}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'DELETE'
      };
    }
  },
  'alerts.load_all_alert_definitions': {
    'real': '/clusters/{clusterName}/alert_definitions?fields=*',
    'mock': 'data/alerts/alertDefinitions.json'
  },
  'alerts.notifications': {
    'real': '/alert_targets?fields=*',
    'mock': '/data/alerts/alertNotifications.json'
  },
  'alerts.instances': {
    'real': '/clusters/{clusterName}/alerts?fields=*',
    'mock': '/data/alerts/alert_instances.json'
  },
  'alerts.instances.unhealthy': {
    'real': '/clusters/{clusterName}/alerts?fields=*&Alert/state.in(CRITICAL,WARNING)&{paginationInfo}',
    'mock': '/data/alerts/alert_instances.json'
  },
  'alerts.instances.by_definition': {
    'real': '/clusters/{clusterName}/alerts?fields=*&Alert/definition_id={definitionId}',
    'mock': '/data/alerts/alert_instances.json'
  },
  'alerts.instances.by_host': {
    'real': '/clusters/{clusterName}/alerts?fields=*&Alert/host_name={hostName}',
    'mock': '/data/alerts/alert_instances.json'
  },
  'alerts.update_alert_definition': {
    'real': '/clusters/{clusterName}/alert_definitions/{id}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify(data.data)
      }
    }
  },
  'alerts.create_alert_definition': {
    'real': '/clusters/{clusterName}/alert_definitions/',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify(data.data)
      }
    }
  },
  'alerts.delete_alert_definition': {
    'real': '/clusters/{clusterName}/alert_definitions/{id}',
    'mock': '',
    'type': 'DELETE'
  },
  'alerts.create_alert_notification': {
    'real': '/alert_targets?{urlParams}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify(data.data)
      }
    }
  },
  'alerts.update_alert_notification': {
    'real': '/alert_targets/{id}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify(data.data)
      }
    }
  },
  'alerts.delete_alert_notification': {
    'real': '/alert_targets/{id}',
    'mock': '',
    'type': 'DELETE'
  },
  'alerts.get_instances_history': {
    'real': '/clusters/{clusterName}/alert_history?(AlertHistory/definition_name={definitionName})&(AlertHistory/timestamp>={timestamp})',
    'mock': '/data/alerts/alert_instances_history.json'
  },
  'background_operations.get_most_recent': {
    'real': '/clusters/{clusterName}/requests?to=end&page_size={operationsCount}&fields=Requests',
    'mock': '/data/background_operations/list_on_start.json',
    'testInProduction': true
  },
  'background_operations.get_by_request': {
    'real': '/clusters/{clusterName}/requests/{requestId}?fields=*,tasks/Tasks/request_id,tasks/Tasks/command,tasks/Tasks/command_detail,tasks/Tasks/start_time,tasks/Tasks/end_time,tasks/Tasks/exit_code,tasks/Tasks/host_name,tasks/Tasks/id,tasks/Tasks/role,tasks/Tasks/status&minimal_response=true',
    'mock': '/data/background_operations/task_by_request{requestId}.json',
    'testInProduction': true
  },
  'background_operations.get_by_task': {
    'real': '/clusters/{clusterName}/requests/{requestId}/tasks/{taskId}',
    'mock': '/data/background_operations/list_on_start.json',
    'testInProduction': true
  },
  'background_operations.abort_request': {
    'real': '/clusters/{clusterName}/requests/{requestId}',
    'mock': '',
    'format': function () {
      return {
        type: 'PUT',
        data: JSON.stringify({
          "Requests": {
            "request_status": "ABORTED",
            "abort_reason": Em.I18n.t('hostPopup.bgop.abortRequest.reason')
          }
        })
      };
    }
  },
  'service.item.smoke': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '/data/wizard/deploy/poll_1.json',
    'format': function (data) {
      var requestData = {
        "RequestInfo": {
          "context": data.displayName + " Service Check",
          "command": data.actionName
        },
        "Requests/resource_filters": [{"service_name": data.serviceName}]
      };
      if (data.operationLevel) {
        requestData.RequestInfo.operation_level = data.operationLevel;
      }
      return {
        'type': 'POST',
        data: JSON.stringify(requestData)
      };
    }
  },
  'service.item.rebalanceHdfsNodes': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          RequestInfo: {
            'context': Em.I18n.t('services.service.actions.run.rebalanceHdfsNodes.context'),
            'command': 'REBALANCEHDFS',
            'namenode': JSON.stringify({threshold: data.threshold})
          },
          "Requests/resource_filters": [{
            'service_name': 'HDFS',
            'component_name': 'NAMENODE',
            'hosts': data.hosts
          }]
        })
      }
    }
  },

  'cancel.background.operation': {
    'real': '/clusters/{clusterName}/requests/{requestId}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            'context': 'Cancel operation',
            "parameters": {
              "cancel_policy": "SIGKILL"
            }
          },
          "Requests/request_status": 'ABORTED',
          "Requests/abort_reason": "Cancel background operation"
        })
      }
    }
  },


  'service.item.refreshQueueYarnRequest': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          RequestInfo: {
            'context': data.context,
            'command': data.command,
            'parameters/forceRefreshConfigTags': data.forceRefreshConfigTags
          },
          "Requests/resource_filters": [{
            "service_name": data.serviceName,
            "component_name": data.componentName,
            'hosts': data.hosts
          }]
        })
      }
    }
  },

  'service.item.startStopLdapKnox': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          RequestInfo: {
            'context': data.context,
            'command': data.command
          },
          "Requests/resource_filters": [{
            "service_name": data.serviceName,
            "component_name": data.componentName,
            'hosts': data.host
          }]
        })
      }
    }
  },

  'service.item.executeCustomCommand': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          RequestInfo: {
            'context': data.context,
            'command': data.command
          },
          "Requests/resource_filters": [{
            "service_name": data.serviceName,
            "component_name": data.componentName,
            'hosts': data.hosts
          }]
        })
      }
    }
  },

  'service.load_config_groups': {
    'real': '/clusters/{clusterName}/config_groups?ConfigGroup/tag={serviceName}&fields=*',
    'mock': '/data/configurations/config_group.json'
  },
  'reassign.load_configs': {
    'real': '/clusters/{clusterName}/configurations?{urlParams}',
    'mock': ''
  },

  'reassign.save_configs': {
    'real': '/clusters/{clusterName}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          Clusters: {
            desired_config: {
              "type": data.siteName,
              "tag": 'version' + (new Date).getTime(),
              "properties": data.properties,
              "service_config_version_note": data.service_config_version_note

            }
          }
        })
      }
    }
  },
  'config.cluster': {
    'real': '{stackVersionUrl}/configurations?fields=*',
    'mock': ''
  },
  'config.advanced': {
    'real': '{stackVersionUrl}/services/{serviceName}/configurations?fields=*',
    'mock': '/data/wizard/stack/hdp/version{stackVersion}/{serviceName}.json'
  },
  'config.advanced.partial': {
    'real': '{stackVersionUrl}/services/?StackServices/service_name.in({serviceList})&fields=configurations/*{queryFilter}',
    'mock': ''
  },
  'config.config_types': {
    'real': '{stackVersionUrl}/services/{serviceName}?fields=StackServices/config_types',
    'mock': ''
  },
  'config.tags': {
    'real': '/clusters/{clusterName}?fields=Clusters/desired_configs',
    'mock': '/data/clusters/cluster.json'
  },
  'config.tags_and_groups': {
    'real': '/clusters/{clusterName}?fields=Clusters/desired_configs,config_groups/*{urlParams}',
    'mock': '/data/clusters/tags_and_groups.json'
  },
  'config.ambari.database.info': {
    'real': '/services/AMBARI/components/AMBARI_SERVER?fields=hostComponents/RootServiceHostComponents/properties/server.jdbc.database_name,hostComponents/RootServiceHostComponents/properties/server.jdbc.url',
    'mock': ''
  },
  'config_groups.all_fields': {
    'real': '/clusters/{clusterName}/config_groups?fields=*',
    'mock': ''
  },
  'config_groups.get_config_group_by_id': {
    'real': '/clusters/{clusterName}/config_groups/{id}',
    'mock': ''
  },
  'config_groups.update_config_group': {
    'real': '/clusters/{clusterName}/config_groups/{id}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify(
          [
            data.configGroup
          ]
        )
      }
    }
  },
  'config.on_site': {
    'real': '/clusters/{clusterName}/configurations?{params}',
    'mock': '/data/configurations/cluster_level_configs.json?{params}'
  },
  'config.host_overrides': {
    'real': '/clusters/{clusterName}/configurations?{params}',
    'mock': '/data/configurations/host_level_overrides_configs.json?{params}'
  },

  'config.cluster_env_site': {
    'real': '/clusters/{clusterName}/configurations?type=cluster-env',
    'mock': '/data/configuration/cluster_env_site.json'
  },

  'host.host_component.add_new_component': {
    'real': '/clusters/{clusterName}/hosts?Hosts/host_name={hostName}',
    'mock': '/data/wizard/deploy/poll_1.json',
    'format': function (data) {
      return {
        type: 'POST',
        data: data.data
      }
    }
  },

  'host.host_component.slave_desired_admin_state': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}/?fields=HostRoles/desired_admin_state',
    'mock': '/data/hosts/HDP2/decommission_state.json'
  },
  'host.host_component.decommission_status': {
    'real': '/clusters/{clusterName}/services/{serviceName}/components/{componentName}/?fields=ServiceComponentInfo,host_components/HostRoles/state',
    'mock': ''
  },
  'host_components.hbase_regionserver.active': {
    'real': '/clusters/{clusterName}/host_components?HostRoles/component_name=HBASE_REGIONSERVER&HostRoles/maintenance_state=OFF&HostRoles/desired_admin_state=INSERVICE&HostRoles/host_name.in({hostNames})',
    'mock': ''
  },
  'host.host_component.decommission_status_datanode': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}?fields=metrics/dfs/namenode',
    'mock': '/data/hosts/HDP2/decommission_state.json'
  },
  'host.region_servers.in_inservice': {
    'real': '/clusters/{clusterName}/host_components?HostRoles/component_name=HBASE_REGIONSERVER&HostRoles/desired_admin_state=INSERVICE&fields=HostRoles/host_name&minimal_response=true',
    'mock': ''
  },
  'host.host_component.decommission_slave': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          RequestInfo: {
            'context': data.context,
            'command': data.command,
            'parameters': {
              'slave_type': data.slaveType,
              'excluded_hosts': data.hostName
            },
            'operation_level': {
              level: "HOST_COMPONENT",
              cluster_name: data.clusterName,
              host_name: data.hostName,
              service_name: data.serviceName
            }
          },
          "Requests/resource_filters": [{"service_name": data.serviceName, "component_name": data.componentName}]
        })
      }
    }
  },
  'host.host_component.recommission_and_restart': {
    'real': '/clusters/{clusterName}/request_schedules',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify([{
          "RequestSchedule": {
            "batch": [{
              "requests": data.batches
            }, {
              "batch_settings": {
                "batch_separation_in_seconds": data.intervalTimeSeconds,
                "task_failure_tolerance": data.tolerateSize
              }
            }]
          }
        }])
      }
    }
  },

  'host.host_component.refresh_configs': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "command": "CONFIGURE",
            "context": data.context
          },
          "Requests/resource_filters": data.resource_filters
        })
      }
    }
  },

  'hosts.metrics': {
    'real': '/clusters/{clusterName}/hosts?fields={metricName}',
    'mock': '/data/cluster_metrics/cpu_1hr.json'
  },
  'hosts.metrics.host_component': {
    'real': '/clusters/{clusterName}/services/{serviceName}/components/{componentName}?fields=host_components/{metricName}',
    'mock': '/data/cluster_metrics/cpu_1hr.json'
  },
  'service.metrics.flume.channel_fill_percent': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/flume/flume/CHANNEL/ChannelFillPercentage[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/channelFillPct.json',
    'testInProduction': true
  },
  'service.metrics.flume.channel_size': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/flume/flume/CHANNEL/ChannelSize[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/channelSize.json',
    'testInProduction': true
  },
  'service.metrics.flume.sink_drain_success': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/flume/flume/SINK/EventDrainSuccessCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/sinkDrainSuccessCount.json',
    'testInProduction': true
  },
  'service.metrics.flume.sink_connection_failed': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/flume/flume/SINK/ConnectionFailedCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/sinkConnectionFailedCount.json',
    'testInProduction': true
  },
  'service.metrics.flume.source_accepted': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/flume/flume/SOURCE/EventAcceptedCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/sourceEventAccepted.json',
    'testInProduction': true
  },
  'service.metrics.flume.channel_size_for_all': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=metrics/flume/flume/CHANNEL/ChannelSize/rate[{fromSeconds},{toSeconds},{stepSeconds}]'
  },
  'service.metrics.flume.gc': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/jvm/gcTimeMillis[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/jvmGcTime.json',
    'testInProduction': true
  },
  'service.metrics.flume.jvm_heap_used': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/jvm/memHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/jvmMemHeapUsedM.json',
    'testInProduction': true
  },
  'service.metrics.flume.jvm_threads_runnable': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/jvm/threadsRunnable[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/flume/jvmThreadsRunnable.json',
    'testInProduction': true
  },
  'service.metrics.flume.cpu_user': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=host_components/metrics/cpu/cpu_user[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.flume.incoming_event_put_successCount': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=metrics/flume/flume/CHANNEL/EventPutSuccessCount/rate[{fromSeconds},{toSeconds},{stepSeconds}]'
  },
  'service.metrics.flume.outgoing_event_take_success_count': {
    'real': '/clusters/{clusterName}/services/FLUME/components/FLUME_HANDLER?fields=metrics/flume/flume/CHANNEL/EventTakeSuccessCount/rate[{fromSeconds},{toSeconds},{stepSeconds}]'
  },
  'service.metrics.hbase.cluster_requests': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_MASTER?fields=metrics/hbase/master/cluster_requests[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/cluster_requests.json',
    'testInProduction': true
  },
  'service.metrics.hbase.hlog_split_size': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_MASTER?fields=metrics/hbase/master/splitSize_avg_time[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/hlog_split_size.json',
    'testInProduction': true
  },
  'service.metrics.hbase.hlog_split_time': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_MASTER?fields=metrics/hbase/master/splitTime_avg_time[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/hlog_split_time.json',
    'testInProduction': true
  },
  'service.metrics.hbase.regionserver_queuesize': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_REGIONSERVER?fields=metrics/hbase/regionserver/flushQueueSize[{fromSeconds},{toSeconds},{stepSeconds}],metrics/hbase/regionserver/compactionQueueSize[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/regionserver_queuesize.json',
    'testInProduction': true
  },
  'service.metrics.hbase.regionserver_regions': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_REGIONSERVER?fields=metrics/hbase/regionserver/regions[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/regionserver_regions.json',
    'testInProduction': true
  },
  'service.metrics.hbase.regionserver_rw_requests': {
    'real': '/clusters/{clusterName}/services/HBASE/components/HBASE_REGIONSERVER?fields=metrics/hbase/regionserver/readRequestsCount[{fromSeconds},{toSeconds},{stepSeconds}],metrics/hbase/regionserver/writeRequestsCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hbase/regionserver_rw_requests.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.block_status': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/dfs/FSNamesystem/PendingReplicationBlocks[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/FSNamesystem/UnderReplicatedBlocks[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/block_status.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.file_operations': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/dfs/namenode/FileInfoOps[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/namenode/CreateFileOps[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/file_operations.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.gc': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/jvm/gcTimeMillis[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/gc.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.io': {
    'real': '/clusters/{clusterName}/services/HDFS/components/DATANODE?fields=metrics/dfs/datanode/bytes_written[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/datanode/bytes_read[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/io.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.jvm_heap': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/jvm/memNonHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memNonHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/jvm_heap.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.jvm_threads': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/jvm/threadsRunnable[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsBlocked[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsWaiting[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsTimedWaiting[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/jvm_threads.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.rpc': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/rpc/RpcQueueTime_avg_time[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/rpc.json',
    'testInProduction': true
  },
  'service.metrics.hdfs.space_utilization': {
    'real': '/clusters/{clusterName}/hosts/{nameNodeName}/host_components/NAMENODE?fields=metrics/dfs/FSNamesystem/CapacityRemaining[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/FSNamesystem/CapacityUsed[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/FSNamesystem/CapacityTotal[{fromSeconds},{toSeconds},{stepSeconds}],metrics/dfs/FSNamesystem/CapacityNonDFSUsed[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/hdfs/space_utilization.json',
    'testInProduction': true
  },
  'service.metrics.yarn.gc': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/jvm/gcTimeMillis[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/yarn/gc.json',
    'testInProduction': true
  },
  'service.metrics.yarn.jobs_threads': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/jvm/threadsRunnable[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsBlocked[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsWaiting[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/threadsTimedWaiting[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/yarn/jvm_threads.json',
    'testInProduction': true
  },
  'service.metrics.yarn.rpc': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/rpc/RpcQueueTime_avg_time[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/yarn/rpc.json',
    'testInProduction': true
  },
  'service.metrics.yarn.jobs_heap': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/jvm/memNonHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memNonHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/services/metrics/yarn/jvm_heap.json',
    'testInProduction': true
  },
  'service.metrics.yarn.queue.allocated': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/yarn/Queue/root/AvailableMB[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/PendingMB[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/AllocatedMB[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.yarn.queue.allocated.container': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/yarn/Queue/root/AllocatedContainers[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/ReservedContainers[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/PendingContainers[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.yarn.node.manager.statuses': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/yarn/ClusterMetrics/NumActiveNMs[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/ClusterMetrics/NumDecommissionedNMs[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/ClusterMetrics/NumLostNMs[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/ClusterMetrics/NumRebootedNMs[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/ClusterMetrics/NumUnhealthyNMs[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.yarn.queue.memory.resource': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=',
    'mock': '',
    'format': function (data, opt) {
      var field1 = 'metrics/yarn/Queue/{queueName}/AllocatedMB[{fromSeconds},{toSeconds},{stepSeconds}]';
      var field2 = 'metrics/yarn/Queue/{queueName}/AvailableMB[{fromSeconds},{toSeconds},{stepSeconds}]';
      if (opt.url != null && data.queueNames != null && data.queueNames.length > 0) {
        data.queueNames.forEach(function (q) {
          data.queueName = q;
          opt.url += (formatUrl(field1, data) + ",");
          opt.url += (formatUrl(field2, data) + ",");
        });
      } else {
        opt.url += (formatUrl(field1, data) + ",");
        opt.url += (formatUrl(field2, data) + ",");
      }
    },
    'testInProduction': true
  },
  'service.metrics.yarn.queue.apps.states.current': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/yarn/Queue/root/AppsPending[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/AppsRunning[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.yarn.queue.apps.states.finished': {
    'real': '/clusters/{clusterName}/hosts/{resourceManager}/host_components/RESOURCEMANAGER?fields=metrics/yarn/Queue/root/AppsKilled[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/AppsFailed[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/AppsSubmitted[{fromSeconds},{toSeconds},{stepSeconds}],metrics/yarn/Queue/root/AppsCompleted[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '',
    'testInProduction': true
  },
  'service.metrics.kafka.broker.topic': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/server/BrokerTopicMetrics/AllTopicsBytesInPerSec/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}],metrics/kafka/server/BrokerTopicMetrics/AllTopicsBytesOutPerSec/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}],metrics/kafka/server/BrokerTopicMetrics/AllTopicsMessagesInPerSec/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.kafka.controller.KafkaController': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/controller/KafkaController/ActiveControllerCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.kafka.controller.ControllerStats': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/controller/ControllerStats/LeaderElectionRateAndTimeMs/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}],metrics/kafka/controller/ControllerStats/UncleanLeaderElectionsPerSec/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.kafka.log.LogFlushStats': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/log/LogFlushStats/LogFlushRateAndTimeMs/1MinuteRate[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.kafka.server.ReplicaManager': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/server/ReplicaManager/PartitionCount[{fromSeconds},{toSeconds},{stepSeconds}],metrics/kafka/server/ReplicaManager/UnderReplicatedPartitions[{fromSeconds},{toSeconds},{stepSeconds}],metrics/kafka/server/BrokerTopicMetrics/ReplicaManager/LeaderCount[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.kafka.server.ReplicaFetcherManager': {
    'real': '/clusters/{clusterName}/services/KAFKA/components/KAFKA_BROKER?fields=metrics/kafka/server/ReplicaFetcherManager/Replica-MaxLag[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': ''
  },
  'service.metrics.storm.nimbus': {
    'real': '/clusters/{clusterName}/services/STORM/components/NIMBUS?fields={metricsTemplate}',
    'mock': ''
  },
  'dashboard.cluster_metrics.cpu': {
    'real': '/clusters/{clusterName}/?fields=metrics/cpu[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/cluster_metrics/cpu_1hr.json',
    'testInProduction': true
  },
  'dashboard.cluster_metrics.load': {
    'real': '/clusters/{clusterName}/?fields=metrics/load[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/cluster_metrics/load_1hr.json',
    'testInProduction': true
  },
  'dashboard.cluster_metrics.memory': {
    'real': '/clusters/{clusterName}/?fields=metrics/memory[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/cluster_metrics/memory_1hr.json',
    'testInProduction': true
  },
  'dashboard.cluster_metrics.network': {
    'real': '/clusters/{clusterName}/?fields=metrics/network[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/cluster_metrics/network_1hr.json',
    'testInProduction': true
  },
  'host.metrics.cpu': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/cpu/cpu_user[{fromSeconds},{toSeconds},{stepSeconds}],metrics/cpu/cpu_wio[{fromSeconds},{toSeconds},{stepSeconds}],metrics/cpu/cpu_nice[{fromSeconds},{toSeconds},{stepSeconds}],metrics/cpu/cpu_aidle[{fromSeconds},{toSeconds},{stepSeconds}],metrics/cpu/cpu_system[{fromSeconds},{toSeconds},{stepSeconds}],metrics/cpu/cpu_idle[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/cpu.json',
    'testInProduction': true
  },
  'host.metrics.disk': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/disk/disk_total[{fromSeconds},{toSeconds},{stepSeconds}],metrics/disk/disk_free[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/disk.json',
    'testInProduction': true
  },
  'host.metrics.load': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/load/load_fifteen[{fromSeconds},{toSeconds},{stepSeconds}],metrics/load/load_one[{fromSeconds},{toSeconds},{stepSeconds}],metrics/load/load_five[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/load.json',
    'testInProduction': true
  },
  'host.metrics.memory': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/memory/swap_free[{fromSeconds},{toSeconds},{stepSeconds}],metrics/memory/mem_shared[{fromSeconds},{toSeconds},{stepSeconds}],metrics/memory/mem_free[{fromSeconds},{toSeconds},{stepSeconds}],metrics/memory/mem_cached[{fromSeconds},{toSeconds},{stepSeconds}],metrics/memory/mem_buffers[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/memory.json',
    'testInProduction': true
  },
  'host.metrics.network': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/network/bytes_in[{fromSeconds},{toSeconds},{stepSeconds}],metrics/network/bytes_out[{fromSeconds},{toSeconds},{stepSeconds}],metrics/network/pkts_in[{fromSeconds},{toSeconds},{stepSeconds}],metrics/network/pkts_out[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/network.json',
    'testInProduction': true
  },
  'host.metrics.processes': {
    'real': '/clusters/{clusterName}/hosts/{hostName}?fields=metrics/process/proc_total[{fromSeconds},{toSeconds},{stepSeconds}],metrics/process/proc_run[{fromSeconds},{toSeconds},{stepSeconds}]',
    'mock': '/data/hosts/metrics/processes.json',
    'testInProduction': true
  },
  'admin.security_status': {
    'real': '/clusters/{clusterName}?fields=Clusters/security_type',
    'mock': '',
    'format': function () {
      return {
        timeout: 10000
      };
    }
  },
  'settings.get.user_pref': {
    'real': '/persist/{key}',
    'mock': '/data/user_settings/{key}.json'
  },
  'settings.post.user_pref': {
    'real': '/persist',
    'mock': '',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify(data.keyValuePair)
      }
    }
  },
  'cluster.load_cluster_name': {
    'real': '/clusters',
    'mock': '/data/clusters/info.json'
  },
  'cluster.update_upgrade_version': {
    'real': '/stacks/{stackName}/versions?fields=services/StackServices,Versions',
    'mock': '/data/wizard/stack/stacks.json',
    'format': function (data) {
      return {
        data: data.data
      };
    }
  },
  'cluster.load_repositories': {
    'real': '/stacks/{stackName}/versions/{stackVersion}/operating_systems?fields=repositories/*',
    'mock': '/data/stacks/HDP-2.1/operating_systems.json',
    'format': function (data) {
      return {
        data: data.data
      };
    }
  },
  'cluster.load_detailed_repo_version': {
    'real': '/clusters/{clusterName}/stack_versions?ClusterStackVersions/state=CURRENT&fields=repository_versions/RepositoryVersions/repository_version&minimal_response=true',
    'mock': '/data/stack_versions/stack_version_all.json'
  },
  'cluster.save_provisioning_state': {
    'real': '/clusters/{clusterName}',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Clusters": {
            "provisioning_state": data.state
          }
        })
      };
    }
  },
  'admin.high_availability.polling': {
    'real': '/clusters/{clusterName}/requests/{requestId}?fields=tasks/*,Requests/*',
    'mock': '/data/background_operations/host_upgrade_tasks.json'
  },
  'admin.high_availability.getNnCheckPointStatus': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/NAMENODE',
    'mock': ''
  },
  'admin.high_availability.getJnCheckPointStatus': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/JOURNALNODE?fields=metrics',
    'mock': ''
  },
  'admin.high_availability.getHostComponent': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/{componentName}',
    'mock': ''
  },
  'admin.high_availability.create_component': {
    'real': '/clusters/{clusterName}/hosts?Hosts/host_name={hostName}',
    'mock': '',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "host_components": [
            {
              "HostRoles": {
                "component_name": data.componentName
              }
            }
          ]
        })
      }
    }
  },
  'admin.high_availability.create_journalnode': {
    'real': '/clusters/{clusterName}/services?ServiceInfo/service_name=HDFS',
    'mock': '',
    'type': 'POST',
    'format': function () {
      return {
        data: JSON.stringify({
          "components": [
            {
              "ServiceComponentInfo": {
                "component_name": "JOURNALNODE"
              }
            }
          ]
        })
      }
    }
  },
  'common.create_component': {
    'real': '/clusters/{clusterName}/services?ServiceInfo/service_name={serviceName}',
    'mock': '',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "components": [
            {
              "ServiceComponentInfo": {
                "component_name": data.componentName
              }
            }
          ]
        })
      }
    }
  },
  'admin.high_availability.create_zkfc': {
    'real': '/clusters/{clusterName}/services?ServiceInfo/service_name=HDFS',
    'mock': '',
    'type': 'POST',
    'format': function () {
      return {
        data: JSON.stringify({
          "components": [
            {
              "ServiceComponentInfo": {
                "component_name": "ZKFC"
              }
            }
          ]
        })
      }
    }
  },
  'admin.high_availability.load_configs': {
    'real': '/clusters/{clusterName}/configurations?(type=core-site&tag={coreSiteTag})|(type=hdfs-site&tag={hdfsSiteTag})',
    'mock': ''
  },
  'admin.high_availability.save_configs': {
    'real': '/clusters/{clusterName}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          Clusters: {
            desired_config: {
              "type": data.siteName,
              "tag": 'version' + (new Date).getTime(),
              "properties": data.properties
            }
          }
        })
      }
    }
  },
  'admin.high_availability.load_hbase_configs': {
    'real': '/clusters/{clusterName}/configurations?type=hbase-site&tag={hbaseSiteTag}',
    'mock': ''
  },
  'admin.security.cluster_configs': {
    'real': '/clusters/{clusterName}',
    'mock': '',
    'format': function () {
      return {
        timeout: 10000
      };
    }
  },
  'admin.get.all_configurations': {
    'real': '/clusters/{clusterName}/configurations?{urlParams}',
    'mock': '',
    'format': function () {
      return {
        timeout: 10000
      };
    }
  },
  'admin.security.add.cluster_configs': {
    'real': '/clusters/{clusterName}' + '?fields=Clusters/desired_configs',
    'mock': '',
    'format': function () {
      return {
        timeout: 10000
      };
    }
  },

  'kerberos.session.state': {
    'real': '/clusters/{clusterName}/services/KERBEROS?fields=Services/attributes/kdc_validation_result,Services/attributes/kdc_validation_failure_details',
    'mock': ''
  },

  'admin.kerberize.cluster': {
    'type': 'PUT',
    'real': '/clusters/{clusterName}',
    'mock': '/data/wizard/kerberos/kerberize_cluster.json',
    'format' : function (data) {
      return {
        data: JSON.stringify(data.data)
      }
    }
  },
  'admin.unkerberize.cluster': {
    'type': 'PUT',
    'real': '/clusters/{clusterName}',
    'format': function (data) {
      return {
        data: JSON.stringify({
          Clusters: {
            security_type: "NONE"
          }
        })
      }
    }
  },
  'get.cluster.artifact': {
    'real': '/clusters/{clusterName}/artifacts/{artifactName}?fields=artifact_data',
    'mock': '/data/wizard/kerberos/stack_descriptors.json'
  },
  'admin.kerberize.stack_descriptor': {
    'real': '/stacks/{stackName}/versions/{stackVersionNumber}/artifacts/kerberos_descriptor?fields=artifact_data',
    'mock': '/data/wizard/kerberos/stack_descriptors.json'
  },
  'admin.kerberize.cluster_descriptor': {
    'real': '/clusters/{clusterName}/artifacts/kerberos_descriptor?fields=artifact_data',
    'mock': '/data/wizard/kerberos/stack_descriptors.json'
  },
  'admin.kerberos.cluster.artifact.create': {
    'type': 'POST',
    'real': '/clusters/{clusterName}/artifacts/{artifactName}',
    'format' : function (data) {
      return {
        data: JSON.stringify(data.data)
      }
    }
  },
  'admin.kerberos.cluster.artifact.update': {
    'type': 'PUT',
    'real': '/clusters/{clusterName}/artifacts/{artifactName}',
    'format' : function (data) {
      return {
        data: JSON.stringify(data.data)
      }
    }
  },
  'admin.poll.kerberize.cluster.request': {
    'real': '/clusters/{clusterName}/requests/{requestId}?fields=stages/Stage/context,stages/Stage/status,stages/Stage/progress_percent,stages/tasks/*,Requests/*',
    'mock': '/data/wizard/kerberos/kerberize_cluster.json'
  },
  'admin.stack_upgrade.run_upgrade': {
    'real': '/clusters/{clusterName}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: data.data
      };
    }
  },
  'admin.user.create': {
    'real': '/users/{user}',
    'mock': '/data/users/users.json',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify(data.data)
      }
    }
  },

  'admin.user.edit': {
    'real': '/users/{user}',
    'mock': '/data/users/users.json',
    'format': function (data) {
      return {
        type: 'PUT',
        data: data.data
      }
    }
  },

  'admin.stack_upgrade.do_poll': {
    'real': '/clusters/{cluster}/requests/{requestId}?fields=tasks/*',
    'mock': '/data/wizard/{mock}'
  },
  'admin.upgrade.data': {
    'real': '/clusters/{clusterName}/upgrades/{id}?upgrade_groups/UpgradeGroup/status!=PENDING&fields=' +
    'Upgrade/progress_percent,Upgrade/request_context,Upgrade/request_status,Upgrade/direction,' +
    'upgrade_groups/UpgradeGroup,' +
    'upgrade_groups/upgrade_items/UpgradeItem/status,' +
    'upgrade_groups/upgrade_items/UpgradeItem/context,' +
    'upgrade_groups/upgrade_items/UpgradeItem/group_id,' +
    'upgrade_groups/upgrade_items/UpgradeItem/progress_percent,' +
    'upgrade_groups/upgrade_items/UpgradeItem/request_id,' +
    'upgrade_groups/upgrade_items/UpgradeItem/skippable,' +
    'upgrade_groups/upgrade_items/UpgradeItem/stage_id,' +
    'upgrade_groups/upgrade_items/UpgradeItem/status,' +
    'upgrade_groups/upgrade_items/UpgradeItem/text&' +
    'minimal_response=true',
    'mock': '/data/stack_versions/upgrade.json'
  },
  'admin.upgrade.state': {
    'real': '/clusters/{clusterName}/upgrades/{id}?fields=Upgrade',
    'mock': '/data/stack_versions/upgrade.json'
  },
  'admin.upgrade.upgrade_item': {
    'real': '/clusters/{clusterName}/upgrades/{upgradeId}/upgrade_groups/{groupId}/upgrade_items/{stageId}?fields=' +
    'UpgradeItem/group_id,' +
    'UpgradeItem/stage_id,' +
    'tasks/Tasks/*&' +
    'minimal_response=true',
    'mock': '/data/stack_versions/upgrade_item.json'
  },
  'admin.upgrade.start': {
    'real': '/clusters/{clusterName}/upgrades',
    'mock': '/data/stack_versions/start_upgrade.json',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Upgrade": {
            "repository_version": data.value
          }
        })
      }
    }
  },
  'admin.downgrade.start': {
    'real': '/clusters/{clusterName}/upgrades',
    'mock': '/data/stack_versions/start_upgrade.json',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Upgrade": {
            "repository_version": data.value,
            "force_downgrade": true
          }
        })
      }
    }
  },
  'admin.upgrade.abort': {
    'real': '/clusters/{clusterName}/upgrades/{upgradeId}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Upgrade": {
            "request_status": "ABORTED"
          }
        })
      }
    }
  },
  'admin.upgrade.upgradeItem.setState': {
    'real': '/clusters/{clusterName}/upgrades/{upgradeId}/upgrade_groups/{groupId}/upgrade_items/{itemId}',
    'mock': '',
    type: 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "UpgradeItem" : {
            "status" : data.status
          }
        })
      };
    }
  },
  'admin.stack_versions.all': {
    'real': '/clusters/{clusterName}/stack_versions?fields=ClusterStackVersions/*,repository_versions/RepositoryVersions/*&minimal_response=true',
    'mock': '/data/stack_versions/stack_version_all.json'
  },
  'admin.stack_version.install.repo_version': {
    'real': '/clusters/{clusterName}/stack_versions',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          ClusterStackVersions: data.ClusterStackVersions
        })
      }
    },
    'mock': ''
  },

  'admin.stack_versions.edit.repo': {
    'real': '/stacks/{stackName}/versions/{stackVersion}/repository_versions/{repoVersionId}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify(data.repoVersion)
      }
    }
  },
  'admin.stack_versions.validate.repo': {
    'real': '/stacks/{stackName}/versions/{stackVersion}/operating_systems/{osType}/repositories/{repoId}?validate_only=true',
    'mock': '',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Repositories": {
            "base_url": data.baseUrl
          }
        })
      }
    }
  },

  'admin.rolling_upgrade.pre_upgrade_check': {
    'real': '/clusters/{clusterName}/rolling_upgrades_check?fields=*&UpgradeChecks/repository_version={value}',
    'mock': '/data/stack_versions/pre_upgrade_check.json'
  },

  'admin.kerberos_security.checks': {
    //TODO when api will be known
    'real': '',
    'mock': '/data/stack_versions/pre_upgrade_check.json'
  },

  'admin.kerberos_security.test_connection': {
    'real': '/kdc_check/{kdcHostname}',
    'mock': '',
    'format': function () {
      return {
        dataType: 'text'
      };
    }
  },

  'admin.kerberos_security.regenerate_keytabs': {
    'real': '/clusters/{clusterName}?regenerate_keytabs={type}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "Clusters" : {
            "security_type" : "KERBEROS"
          }
        })
      }
    }
  },

  'wizard.advanced_repositories.valid_url': {
    'real': '/stacks/{stackName}/versions/{stackVersion}/operating_systems/{osType}/repositories/{repoId}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify(data.data)
      }
    }
  },
  'wizard.service_components': {
    'real': '{stackUrl}/services?fields=StackServices/*,components/*,components/dependencies/Dependencies/scope',
    'mock': '/data/stacks/HDP-2.1/service_components.json',
    'format': function (data) {
      return {
        timeout: 10000
      };
    }
  },
  'wizard.step9.installer.get_host_status': {
    'real': '/clusters/{cluster}/hosts?fields=Hosts/host_state,host_components/HostRoles/state',
    'mock': '/data/wizard/deploy/5_hosts/get_host_state.json'
  },
  'wizard.step9.load_log': {
    'real': '/clusters/{cluster}/requests/{requestId}?fields=tasks/Tasks/command,tasks/Tasks/exit_code,tasks/Tasks/start_time,tasks/Tasks/end_time,tasks/Tasks/host_name,tasks/Tasks/id,tasks/Tasks/role,tasks/Tasks/status&minimal_response=true',
    'mock': '/data/wizard/deploy/5_hosts/poll_{numPolls}.json',
    'format': function () {
      return {
        dataType: 'text'
      };
    }
  },

  'wizard.step8.existing_cluster_names': {
    'real': '/clusters',
    'mock': ''
  },

  'wizard.step8.create_cluster': {
    'real': '/clusters/{cluster}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.create_selected_services': {
    'type': 'POST',
    'real': '/clusters/{cluster}/services',
    'mock': '/data/stacks/HDP-2.1/recommendations.json',
    'format': function (data) {
      return {
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.create_components': {
    'real': '/clusters/{cluster}/services?ServiceInfo/service_name={serviceName}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.register_host_to_cluster': {
    'real': '/clusters/{cluster}/hosts',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.register_host_to_component': {
    'real': '/clusters/{cluster}/hosts',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.apply_configuration_groups': {
    'real': '/clusters/{cluster}/config_groups',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        dataType: 'text',
        data: data.data
      }
    }
  },

  'wizard.step8.set_local_repos': {
    'real': '{stackVersionURL}/operating_systems/{osType}/repositories/{repoId}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        dataType: 'text',
        data: data.data
      }
    }
  },
  'wizard.step3.jdk_check': {
    'real': '/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "context": "Check hosts",
            "action": "check_host",
            "parameters": {
              "threshold": "60",
              "java_home": data.java_home,
              "jdk_location": data.jdk_location,
              "check_execute_list": "java_home_check"
            }
          },
          "Requests/resource_filters": [{
            "hosts": data.host_names
          }]
        })
      }
    }
  },
  'wizard.step3.jdk_check.get_results': {
    'real': '/requests/{requestIndex}?fields=*,tasks/Tasks/host_name,tasks/Tasks/status,tasks/Tasks/structured_out',
    'mock': '/data/requests/host_check/jdk_check_results.json'
  },
  'wizard.step3.host_info': {
    'real': '/hosts?fields=Hosts/total_mem,Hosts/cpu_count,Hosts/disk_info,Hosts/last_agent_env,Hosts/host_name,Hosts/os_type,Hosts/os_arch,Hosts/ip',
    'mock': '/data/wizard/bootstrap/two_hosts_information.json',
    'format': function () {
      return {
        contentType: 'application/json'
      };
    }
  },


  'wizard.loadrecommendations': {
    'real': '{stackVersionUrl}/recommendations',
    'mock': '/data/stacks/HDP-2.1/recommendations.json',
    'type': 'POST',
    'format': function (data) {
      var q = {
        hosts: data.hosts,
        services: data.services,
        recommend: data.recommend
      };

      if (data.recommendations) {
        q.recommendations = data.recommendations;
      }

      return {
        data: JSON.stringify(q)
      }
    }
  },


  // TODO: merge with wizard.loadrecommendations query
  'wizard.step7.loadrecommendations.configs': {
    'real': '{stackVersionUrl}/recommendations',
    'mock': '/data/stacks/HDP-2.1/recommendations_configs.json',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          hosts: data.hosts,
          services: data.services,
          recommendations: data.recommendations,
          recommend: "configurations"
        })
      }
    }
  },

  'config.validations': {
    'real': '{stackVersionUrl}/validations',
    'mock': '/data/stacks/HDP-2.1/validations.json',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          hosts: data.hosts,
          services: data.services,
          validate: data.validate,
          recommendations: data.recommendations
        })
      }
    }
  },


  'preinstalled.checks': {
    'real': '/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": data.RequestInfo,
          "Requests/resource_filters": [data.resource_filters]
        })
      }
    }
  },

  'preinstalled.checks.tasks': {
    'real': '/requests/{requestId}?fields=tasks/Tasks,Requests/inputs,Requests/request_status',
    'mock': '/data/requests/host_check/1.json'
  },

  'wizard.step3.rerun_checks': {
    'real': '/hosts?fields=Hosts/last_agent_env',
    'mock': '/data/wizard/bootstrap/two_hosts_information.json',
    'format': function () {
      return {
        contentType: 'application/json'
      };
    }
  },
  'wizard.step3.bootstrap': {
    'real': '/bootstrap/{bootRequestId}',
    'mock': '/data/wizard/bootstrap/poll_{numPolls}.json'
  },
  'wizard.step3.is_hosts_registered': {
    'real': '/hosts?fields=Hosts/host_status',
    'mock': '/data/wizard/bootstrap/single_host_registration.json'
  },
  'wizard.stacks': {
    'real': '/stacks',
    'mock': '/data/wizard/stack/stacks2.json'
  },
  'wizard.stacks_versions': {
    'real': '/stacks/{stackName}/versions?fields=Versions,operating_systems/repositories/Repositories',
    'mock': '/data/wizard/stack/{stackName}_versions.json'
  },
  'wizard.launch_bootstrap': {
    'real': '/bootstrap',
    'mock': '/data/wizard/bootstrap/bootstrap.json',
    'type': 'POST',
    'format': function (data) {
      return {
        contentType: 'application/json',
        data: data.bootStrapData,
        popup: data.popup
      }
    }
  },
  'router.login': {
    'real': '/users/{loginName}?fields=*,privileges/PrivilegeInfo/cluster_name,privileges/PrivilegeInfo/permission_name',
    'mock': '/data/users/user_{usr}.json',
    'format': function (data) {
      var statusCode = jQuery.extend({}, require('data/statusCodes'));
      statusCode['403'] = function () {
        console.log("Error code 403: Forbidden.");
      };
      return {
        statusCode: statusCode
      };
    }
  },
  'users.all': {
    real: '/users/?fields=*',
    mock: '/data/users/users.json'
  },
  'users.privileges': {
    real: '/privileges?fields=*',
    mock: '/data/users/privileges.json'
  },
  'router.user.privileges': {
    real: '/privileges?PrivilegeInfo/principal_name={userName}&fields=*',
    mock: '/data/users/privileges_{userName}.json'
  },
  'router.login.clusters': {
    'real': '/clusters?fields=Clusters/provisioning_state',
    'mock': '/data/clusters/info.json'
  },
  'router.logoff': {
    'real': '/logout',
    'mock': ''
  },
  'ambari.service.load_jdk_name': {
    'real': '/services/AMBARI/components/AMBARI_SERVER?fields=RootServiceComponents/properties/jdk.name,RootServiceComponents/properties/java.home,RootServiceComponents/properties/jdk_location',
    'mock': '/data/requests/host_check/jdk_name.json'
  },
  'ambari.service.load_server_version': {
    'real': '/services/AMBARI/components/AMBARI_SERVER?fields=RootServiceComponents/component_version,RootServiceComponents/properties/server.os_family&minimal_response=true',
    'mock': '/data/ambari_components/component_version.json'
  },
  'ambari.service': {
    'real': '/services/AMBARI/components/AMBARI_SERVER',
    'mock': '/data/services/ambari_server.json'
  },
  'ambari.service.load_server_clock': {
    'real': '/services/AMBARI/components/AMBARI_SERVER?fields=RootServiceComponents/server_clock',
    'mock': ''
  },

  'config_groups.create': {
    'real': '/clusters/{clusterName}/config_groups',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify([{
          "ConfigGroup": {
            "group_name": data.group_name,
            "tag": data.service_id,
            "description": data.description,
            "desired_configs": data.desired_configs,
            "hosts": data.hosts
          }
        }])
      }
    }
  },
  'config_groups.update': {
    'real': '/clusters/{clusterName}/config_groups/{id}',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify(data.data)
      }
    }
  },
  'rolling_restart.post': {
    'real': '/clusters/{clusterName}/request_schedules',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify([{
          "RequestSchedule": {
            "batch": [{
              "requests": data.batches
            }, {
              "batch_settings": {
                "batch_separation_in_seconds": data.intervalTimeSeconds,
                "task_failure_tolerance": data.tolerateSize
              }
            }]
          }
        }])
      }
    }
  },
  'request_schedule.get': {
    'real': '/clusters/{clusterName}/request_schedules/{request_schedule_id}',
    'mock': ''
  },
  'restart.hostComponents': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "command": "RESTART",
            "context": data.context,
            "operation_level": data.operation_level
          },
          "Requests/resource_filters": data.resource_filters
        })
      }
    }
  },

  'bulk_request.decommission': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          'RequestInfo': {
            'context': data.context,
            'command': 'DECOMMISSION',
            'parameters': data.parameters,
            'operation_level': {
              'level': "CLUSTER",
              'cluster_name': data.clusterName
            }
          },
          "Requests/resource_filters": [{"service_name": data.serviceName, "component_name": data.componentName}]
        })
      }
    }
  },

  'bulk_request.hosts.passive_state': {
    'real': '/clusters/{clusterName}/hosts',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            context: data.requestInfo,
            query: 'Hosts/host_name.in(' + data.hostNames + ')'
          },
          Body: {
            Hosts: {
              maintenance_state: data.passive_state
            }
          }
        })
      }
    }
  },

  'bulk_request.hosts.all_components.passive_state': {
    'real': '/clusters/{clusterName}/host_components',
    'mock': '',
    'format': function (data) {
      return {
        type: 'PUT',
        data: JSON.stringify({
          RequestInfo: {
            context: data.requestInfo,
            query: data.query
          },
          Body: {
            HostRoles: {
              maintenance_state: data.passive_state
            }
          }
        })
      }
    }
  },
  'views.info': {
    'real': '/views',
    'mock': '/data/views/views.json'
  },
  /**
   * Get all instances of all views across versions
   */
  'views.instances': {
    'real': '/views?fields=versions/instances/ViewInstanceInfo,versions/ViewVersionInfo/label&versions/ViewVersionInfo/system=false',
    'mock': '/data/views/instances.json'
  },
  'host.host_component.flume.metrics': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/host_components/FLUME_HANDLER?fields=metrics/flume/flume/{flumeComponent}/*',
    'mock': ''
  },
  'host.host_component.flume.metrics.timeseries': {
    'real': '',
    'mock': '',
    format: function (data) {
      return {
        url: data.url
      }
    }
  },
  'host.host_components.filtered': {
    'real': '/clusters/{clusterName}/hosts?{fields}',
    'mock': '',
    format: function (data) {
      return {
        headers: {
          'X-Http-Method-Override': 'GET'
        },
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {"query": data.parameters}
        })
      };
    }
  },
  'host.status.counters': {
    'real': '/clusters/{clusterName}?fields=Clusters/health_report,Clusters/total_hosts,alerts_summary_hosts&minimal_response=true',
    'mock': '/data/hosts/HDP2/host_status_counters.json'
  },
  'host.stack_versions.install': {
    'real': '/clusters/{clusterName}/hosts/{hostName}/stack_versions',
    'mock': '',
    'type': 'POST',
    'format': function (data) {
      return {
        data: JSON.stringify({
          "HostStackVersions": {
            "stack": data.version.get('stack'),
            "version": data.version.get('version'),
            "repository_version": data.version.get('repoVersion')
          }
        })
      }
    }
  },
  'components.filter_by_status': {
    'real': '/clusters/{clusterName}/components?fields=host_components/HostRoles/host_name,ServiceComponentInfo/component_name,ServiceComponentInfo/started_count{urlParams}&minimal_response=true',
    'mock': ''
  },
  'hosts.all.install': {
    'real': '/hosts?minimal_response=true',
    'mock': ''
  },
  'hosts.all': {
    'real': '/clusters/{clusterName}/hosts?minimal_response=true',
    'mock': '/data/hosts/HDP2/hosts.json'
  },
  'hosts.with_public_host_names': {
    'real': '/clusters/{clusterName}/hosts?fields=Hosts/public_host_name&minimal_response=true',
    'mock': ''
  },
  'hosts.for_quick_links': {
    'real': '/clusters/{clusterName}/hosts?Hosts/host_name.in({masterHosts})&fields=Hosts/public_host_name,host_components/HostRoles/component_name{urlParams}&minimal_response=true',
    'mock': '/data/hosts/quick_links.json'
  },
  'hosts.confirmed.install': {
    'real': '/hosts?fields=Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem&minimal_response=true',
    'mock': ''
  },
  'hosts.confirmed': {
    'real': '/clusters/{clusterName}/hosts?fields=Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem,Hosts/os_type,Hosts/os_arch,Hosts/ip,host_components/HostRoles/state&minimal_response=true',
    'mock': '/data/hosts/HDP2/hosts.json'
  },
  'host_components.all': {
    'real': '/clusters/{clusterName}/host_components?fields=HostRoles/host_name&minimal_response=true',
    'mock': ''
  },
  'host_components.with_services_names': {
    'real': '/clusters/{clusterName}/host_components?fields=component/ServiceComponentInfo/service_name,HostRoles/host_name&minimal_response=true',
    'mock': ''
  },
  'components.get_installed': {
    'real': '/clusters/{clusterName}/components',
    'mock': ''
  },
  'hosts.heatmaps': {
    'real': '/clusters/{clusterName}/hosts?fields=Hosts/host_name,Hosts/public_host_name,Hosts/os_type,Hosts/ip,host_components,metrics/disk,metrics/cpu/cpu_system,metrics/cpu/cpu_user,metrics/memory/mem_total,metrics/memory/mem_free&minimal_response=true',
    'mock': '/data/hosts/HDP2/hosts.json'
  },
  'namenode.cpu_wio': {
    'real': '/clusters/{clusterName}/hosts/{nnHost}?fields=metrics/cpu',
    'mock': '/data/cluster_metrics/cpu.json'
  },

  'custom_action.create': {
    'real': '/requests',
    'mock': '',
    'format': function (data) {
      var requestInfo = {
        context: 'Check host',
        action: 'check_host',
        parameters: {}
      };
      $.extend(true, requestInfo, data.requestInfo);
      return {
        type: 'POST',
        data: JSON.stringify({
          'RequestInfo': requestInfo,
          'Requests/resource_filters': [{
            hosts: data.filteredHosts.join(',')
          }]
        })
      }
    }
  },
  'custom_action.request': {
    'real': '/requests/{requestId}/tasks/{taskId}',
    'mock': '/data/requests/1.json',
    'format': function (data) {
      return {
        requestId: data.requestId,
        taskId: data.taskId || ''
      }
    }
  },
  'hosts.high_availability.wizard': {
    'real': '/clusters/{clusterName}/hosts?fields=Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem&minimal_response=true',
    'mock': ''
  },
  'hosts.security.wizard': {
    'real': '/clusters/{clusterName}/hosts?fields=host_components/HostRoles/service_name&minimal_response=true',
    'mock': ''
  },
  'host_component.installed.on_hosts': {
    'real': '/clusters/{clusterName}/host_components?HostRoles/component_name={componentName}&HostRoles/host_name.in({hostNames})&fields=HostRoles/host_name&minimal_response=true',
    'mock': ''
  },
  'hosts.by_component.one': {
    'real': '/clusters/{clusterName}/hosts?host_components/HostRoles/component_name.in({componentNames})&fields=host_components,Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem,Hosts/ip,Hosts/os_type,Hosts/os_arch,Hosts/public_host_name&page_size=1&minimal_response=true',
    'mock': ''
  },
  'hosts.by_component.all': {
    'real': '/clusters/{clusterName}/hosts?host_components/HostRoles/component_name.in({componentNames})&fields=host_components,Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem,Hosts/ip,Hosts/os_type,Hosts/os_arch,Hosts/public_host_name&minimal_response=true',
    'mock': ''
  },
  'hosts.config_groups': {
    'real': '/clusters/{clusterName}/hosts?fields=Hosts/cpu_count,Hosts/disk_info,Hosts/total_mem,Hosts/ip,Hosts/os_type,Hosts/os_arch,Hosts/public_host_name,host_components&minimal_response=true',
    'mock': ''
  },
  'hosts.host_components.pre_load': {
    real: '',
    mock: '/data/hosts/HDP2/hosts.json',
    format: function (data) {
      return {
        url: data.url
      }
    }
  },
  'hosts.bulk.operations': {
    real: '/clusters/{clusterName}/hosts?fields=Hosts/host_name,Hosts/maintenance_state,' +
    'host_components/HostRoles/state,host_components/HostRoles/maintenance_state,' +
    'Hosts/total_mem,stack_versions/HostStackVersions,stack_versions/repository_versions/RepositoryVersions/repository_version,' +
    'stack_versions/repository_versions/RepositoryVersions/id,' +
    'host_components/HostRoles/stale_configs&minimal_response=true',
    mock: '',
    format: function (data) {
      return {
        headers: {
          'X-Http-Method-Override': 'GET'
        },
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {"query": data.parameters}
        })
      }
    }
  },
  'service.serviceConfigVersions.get': {
    real: '/clusters/{clusterName}/configurations/service_config_versions?service_name={serviceName}&fields=service_config_version,user,hosts,group_id,group_name,is_current,createtime,service_name,service_config_version_note&minimal_response=true',
    mock: '/data/configurations/service_versions.json'
  },
  'service.serviceConfigVersions.get.current': {
    real: '/clusters/{clusterName}?fields=Clusters/desired_service_config_versions&minimal_response=true',
    mock: ''
  },
  'service.serviceConfigVersions.get.total': {
    real: '/clusters/{clusterName}/configurations/service_config_versions?page_size=1&minimal_response=true',
    mock: '/data/configurations/service_versions_total.json'
  },
  'service.serviceConfigVersion.get': {
    real: '/clusters/{clusterName}/configurations/service_config_versions?service_name={serviceName}&service_config_version={serviceConfigVersion}',
    mock: '/data/configurations/service_version.json'
  },
  'service.serviceConfigVersions.get.multiple': {
    real: '/clusters/{clusterName}/configurations/service_config_versions?service_name={serviceName}&service_config_version.in({serviceConfigVersions})',
    mock: '/data/configurations/service_version.json',
    format: function (data) {
      return {
        serviceConfigVersions: data.serviceConfigVersions.join(',')
      }
    }
  },
  'service.serviceConfigVersion.revert': {
    'real': '/clusters/{clusterName}',
    'mock': '',
    'type': 'PUT',
    'format': function (data) {
      return {
        data: JSON.stringify(data.data)
      }
    }
  },

  'service.mysql.clean': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "command" : "CLEAN", "context" : "Clean MYSQL Server"
          },
          "Requests/resource_filters": [{
              "service_name" : "HIVE",
              "component_name" : "MYSQL_SERVER",
              "hosts": data.host
          }]
        })
      }
    }
  },

  'service.mysql.configure': {
    'real': '/clusters/{clusterName}/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "command" : "CONFIGURE", "context" : "Configure MYSQL Server"
          },
          "Requests/resource_filters": [{
              "service_name" : "HIVE",
              "component_name" : "MYSQL_SERVER",
              "hosts": data.host
          }]
        })
      }
    }
  },

  'service.mysql.testHiveConnection': {
    'real': '/requests',
    'mock': '',
    'format': function (data) {
      return {
        type: 'POST',
        data: JSON.stringify({
          "RequestInfo": {
            "context": "Check host",
            "action": "check_host",
            "parameters":{
              "db_name": data.db_name,
              "user_name": data.db_user,
              "user_passwd": data.db_pass,
              "db_connection_url": data.db_connection_url,
              "jdk_location": data.jdk_location,
              "threshold":"60",
              "ambari_server_host": "c6403.ambari.apache.org",
              "check_execute_list":"db_connection_check",
              "java_home": data.java_home,
              "jdk_name": data.jdk_name
            }
          },
          "Requests/resource_filters": [{"hosts": data.hosts}]})
      }
    }
  }
};
/**
 * Replace data-placeholders to its values
 *
 * @param {String} url
 * @param {Object} data
 * @return {String}
 */
var formatUrl = function (url, data) {
  if (!url) return null;
  var keys = url.match(/\{\w+\}/g);
  keys = (keys === null) ? [] : keys;
  if (keys) {
    keys.forEach(function (key) {
      var raw_key = key.substr(1, key.length - 2);
      var replace;
      if (!data || !data[raw_key]) {
        replace = '';
      }
      else {
        replace = data[raw_key];
      }
      url = url.replace(new RegExp(key, 'g'), replace);
    });
  }
  return url;
};

/**
 * this = object from config
 * @return {Object}
 */
var formatRequest = function (data) {
  var opt = {
    type: this.type || 'GET',
    timeout: App.timeout,
    dataType: 'json',
    statusCode: require('data/statusCodes')
  };
  if (App.get('testMode')) {
    opt.url = formatUrl(this.mock ? this.mock : '', data);
    opt.type = 'GET';
  }
  else {
    var prefix = this.apiPrefix != null ? this.apiPrefix : App.apiPrefix;
    opt.url = prefix + formatUrl(this.real, data);
  }

  if (this.format) {
    jQuery.extend(opt, this.format(data, opt));
  }
  return opt;
};

/**
 * Wrapper for all ajax requests
 *
 * @type {Object}
 */
var ajax = Em.Object.extend({
  /**
   * Send ajax request
   *
   * @param {Object} config
   * @return {$.ajax} jquery ajax object
   *
   * config fields:
   *  name - url-key in the urls-object *required*
   *  sender - object that send request (need for proper callback initialization) *required*
   *  data - object with data for url-format
   *  beforeSend - method-name for ajax beforeSend response callback
   *  success - method-name for ajax success response callback
   *  error - method-name for ajax error response callback
   *  callback - callback from <code>App.updater.run</code> library
   */
  send: function (config) {

    if (!config.sender) {
      console.warn('Ajax sender should be defined!');
      return null;
    }

    // default parameters
    var params = {
      clusterName: (App.get('clusterName') || App.clusterStatus.get('clusterName'))
    };

    // extend default parameters with provided
    if (config.data) {
      jQuery.extend(params, config.data);
    }

    var opt = {};
    if (!urls[config.name]) {
      console.warn('Invalid name provided!');
      return null;
    }
    opt = formatRequest.call(urls[config.name], params);

    opt.context = this;

    // object sender should be provided for processing beforeSend, success and error responses
    opt.beforeSend = function (xhr) {
      if (config.beforeSend) {
        config.sender[config.beforeSend](opt, xhr, params);
      }
    };
    opt.success = function (data, textStatus, request) {
      console.log("TRACE: The url is: " + opt.url);
      if (config.success) {
        config.sender[config.success](data, opt, params, request);
      }
    };
    opt.error = function (request, ajaxOptions, error) {
      var KDCErrorMsg = this.getKDCErrorMgs(request);
      if (!Em.isNone(KDCErrorMsg)) {
        /**
         * run this handler before show KDC error popup
         */
        if (config.kdcFailHandler) {
          config.sender[config.kdcFailHandler](request, ajaxOptions, error, opt, params);
        }
        /**
         * run this handler when click cancle on KDC error popup
         */
        if (config.kdcCancelHandler) {
          opt.kdcCancelHandler = function() {
            config.sender[config.kdcCancelHandler]();
          };
        }
        this.defaultErrorKDCHandler(opt, KDCErrorMsg);
      } else if (config.error) {
        config.sender[config.error](request, ajaxOptions, error, opt, params);
      } else {
        this.defaultErrorHandler(request, opt.url, opt.type);
      }
    };
    opt.complete = function () {
      if (config.callback) {
        config.callback();
      }
    };
    if ($.mocho) {
      opt.url = 'http://' + $.hostName + opt.url;
    }
    return $.ajax(opt);
  },

  // A single instance of App.ModalPopup view
  modalPopup: null,
  /**
   * defaultErrorHandler function is referred from App.ajax.send function and App.HttpClient.defaultErrorHandler function
   * @jqXHR {jqXHR Object}
   * @url {string}
   * @method {String} Http method
   * @showStatus {number} HTTP response code which should be shown. Default is 500.
   */
  defaultErrorHandler: function (jqXHR, url, method, showStatus) {
    method = method || 'GET';
    var self = this;
    try {
      var json = $.parseJSON(jqXHR.responseText);
      var message = json.message;
    } catch (err) {
    }
    if (!showStatus) {
      showStatus = 500;
    }
    if (jqXHR.status === showStatus && !this.get('modalPopup')) {
      this.set('modalPopup', App.ModalPopup.show({
        header: Em.I18n.t('common.error'),
        secondary: false,
        onPrimary: function () {
          this.hide();
          self.set('modalPopup', null);
        },
        bodyClass: App.AjaxDefaultErrorPopupBodyView.extend({
          type: method,
          url: url,
          status: jqXHR.status,
          message: message
        })
      }));
    }
  },

  /**
   * defines if it's admin session expiration error
   * and if so returns short error message
   * @param jqXHR
   * @returns {string|null}
   */
  getKDCErrorMgs: function(jqXHR) {
    try {
      var message = $.parseJSON(jqXHR.responseText).message;
    } catch (err) {}
    if (jqXHR.status === 400 && message) {
      return App.format.kdcErrorMsg(message, true);
    }
  },

  /**
   * default handler for admin session expiration error
   * @param {object} opt
   * @param {string} msg
   * @returns {*}
   */
  defaultErrorKDCHandler: function(opt, msg) {
    return App.showInvalidKDCPopup(opt, msg);
  }

});

/**
 * Add few access-methods for test purposes
 */
if ($.mocho) {
  ajax.reopen({
    /**
     * Don't use it anywhere except tests!
     * @returns {Array}
     */
    fakeGetUrlNames: function () {
      return Em.keys(urls);
    },

    /**
     * Don't use it anywhere except tests!
     * @param name
     * @returns {*}
     */
    fakeGetUrl: function (name) {
      return urls[name];
    },

    /**
     * Don't use it anywhere except tests!
     * @param url
     * @param data
     * @returns {String}
     */
    fakeFormatUrl: function (url, data) {
      return formatUrl(url, data);
    },

    /**
     * Don't use it anywhere except tests!
     * @param urlObj
     * @param data
     * @returns {Object}
     */
    fakeFormatRequest: function (urlObj, data) {
      return formatRequest.call(urlObj, data);
    }
  });
}

App.ajax = ajax.create({});
