// utility function to write a grafana dashboard configured to check for the number of brokers in the user's cluster
export default (numberOfBrokers: String) => {
  return (`
  {
    "annotations": {
      "list": [
        {
          "builtIn": 1,
          "datasource": {
            "type": "datasource",
            "uid": "grafana"
          },
          "enable": true,
          "hide": true,
          "iconColor": "rgba(0, 211, 255, 1)",
          "name": "Annotations & Alerts",
          "type": "dashboard"
        }
      ]
    },
    "editable": true,
    "fiscalYearStartMonth": 0,
    "graphTooltip": 0,
    "links": [],
    "liveNow": false,
    "refresh": "5s",
    "schemaVersion": 38,
    "style": "dark",
    "tags": [
      "kafka",
      "broker",
      "healthcheck"
    ],
    "templating": {
      "list": [
        {
          "current": {
            "selected": false,
            "text": "cluster-demo",
            "value": "cluster-demo"
          },
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "definition": "",
          "hide": 0,
          "includeAll": false,
          "label": "Environment",
          "multi": false,
          "name": "env",
          "options": [],
          "query": "label_values(kafka_server_brokerstate, env)",
          "refresh": 1,
          "regex": "",
          "skipUrlSync": false,
          "sort": 0,
          "tagValuesQuery": "",
          "tagsQuery": "",
          "type": "query",
          "useTags": false
        }
      ]
    },
    "panels": [
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "description": "Number of active controllers in the cluster. Alert if the aggregated sum across all brokers in the cluster is anything other than 1 because there should be exactly one controller per cluster.",
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "#d44a3a",
                  "value": null
                },
                {
                  "color": "rgba(237, 129, 40, 0.89)",
                  "value": 0
                },
                {
                  "color": "#299c46",
                  "value": 1
                }
              ]
            },
            "unit": "none"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 3,
          "w": 3,
          "x": 0,
          "y": 1
        },
        "id": 4,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "background",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "sum(kafka_controller_activecontrollercount{env=\\"$env\\"})",
            "format": "time_series",
            "instant": true,
            "intervalFactor": 1,
            "legendFormat": "",
            "refId": "A"
          }
        ],
        "title": "Active Controller",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "description": "Total number of brokers with a state running",
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "decimals": 0,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "#d44a3a",
                  "value": null
                },
                {
                  "color": "rgba(237, 129, 40, 0.89)",
                  "value": 1
                },
                {
                  "color": "#299c46",
                  "value": 3
                }
              ]
            },
            "unit": "none"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 3,
          "w": 3,
          "x": 0,
          "y": 4
        },
        "id": 5,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "background",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "count((kafka_server_brokerstate{env=\\"$env\\"}) == 3 or (kafka_server_brokerstate{env=\\"$env\\"}) == 4)",
            "format": "time_series",
            "intervalFactor": 1,
            "refId": "A"
          }
        ],
        "title": "Brokers Running",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "description": "Total number of brokers with a state offline (i.e 0)",
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "decimals": 0,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "#d44a3a",
                  "value": null
                },
                {
                  "color": "#299c46",
                  "value": 0
                },
                {
                  "color": "rgba(237, 129, 40, 0.89)",
                  "value": 1
                }
              ]
            },
            "unit": "none"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 3,
          "w": 3,
          "x": 0,
          "y": 7
        },
        "id": 6,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "background",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "editorMode": "code",
            "expr": "${numberOfBrokers}-count((kafka_server_brokerstate{env=\\"$env\\"}) == 3 or (kafka_server_brokerstate{env=\\"$env\\"}) == 4)",
            "format": "time_series",
            "intervalFactor": 1,
            "range": true,
            "refId": "A"
          }
        ],
        "title": "Brokers Offline",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "description": "Total number of producer requests per second",
        "fieldConfig": {
          "defaults": {
            "color": {
              "fixedColor": "rgb(31, 120, 193)",
              "mode": "fixed"
            },
            "decimals": 0,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "green",
                  "value": null
                },
                {
                  "color": "red",
                  "value": 80
                }
              ]
            },
            "unit": "none"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 3,
          "w": 4,
          "x": 3,
          "y": 4
        },
        "id": 7,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "none",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "sum(kafka_network_request_per_sec{aggregate=~\\"OneMinuteRate\\",request=~\\"Produce\\",env=\\"$env\\"})",
            "format": "time_series",
            "intervalFactor": 1,
            "refId": "A"
          }
        ],
        "title": "Produce Req Per Sec",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "fieldConfig": {
          "defaults": {
            "color": {
              "fixedColor": "rgb(31, 120, 193)",
              "mode": "fixed"
            },
            "decimals": 2,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "green",
                  "value": null
                },
                {
                  "color": "red",
                  "value": 80
                }
              ]
            },
            "unit": "Bps"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 4,
          "w": 5,
          "x": 19,
          "y": 15
        },
        "id": 8,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "none",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "sum(kafka_server_broker_topic_metrics_bytesinpersec_rate{topic=\\"\\"}) by (broker)",
            "format": "time_series",
            "instant": false,
            "intervalFactor": 1,
            "refId": "A"
          }
        ],
        "title": "Bytes In per sec",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "fieldConfig": {
          "defaults": {
            "color": {
              "fixedColor": "rgb(31, 120, 193)",
              "mode": "fixed"
            },
            "decimals": 0,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "green",
                  "value": null
                },
                {
                  "color": "red",
                  "value": 80
                }
              ]
            },
            "unit": "none"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 3,
          "w": 4,
          "x": 7,
          "y": 4
        },
        "id": 9,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "none",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "sum(kafka_network_request_per_sec{aggregate=~\\"OneMinuteRate\\",request=~\\"FetchConsumer\\",env=\\"$env\\"})",
            "format": "time_series",
            "intervalFactor": 1,
            "refId": "A"
          }
        ],
        "title": "Fetch Consumer Req Per Sec",
        "type": "stat"
      },
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "fieldConfig": {
          "defaults": {
            "color": {
              "fixedColor": "rgb(31, 120, 193)",
              "mode": "fixed"
            },
            "decimals": 2,
            "mappings": [
              {
                "options": {
                  "match": "null",
                  "result": {
                    "text": "N/A"
                  }
                },
                "type": "special"
              }
            ],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "green",
                  "value": null
                },
                {
                  "color": "red",
                  "value": 80
                }
              ]
            },
            "unit": "Bps"
          },
          "overrides": []
        },
        "gridPos": {
          "h": 4,
          "w": 5,
          "x": 19,
          "y": 19
        },
        "id": 10,
        "links": [],
        "maxDataPoints": 100,
        "options": {
          "colorMode": "none",
          "graphMode": "none",
          "justifyMode": "auto",
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "textMode": "auto"
        },
        "pluginVersion": "9.5.2",
        "targets": [
          {
            "datasource": {
              "type": "prometheus",
              "uid": "PBFA97CFB590B2093"
            },
            "expr": "sum(kafka_server_broker_topic_metrics_bytesoutpersec_rate{topic=\\"\\"}) by (broker)",
            "format": "time_series",
            "instant": false,
            "intervalFactor": 1,
            "refId": "A"
          }
        ],
        "title": "Bytes Out per sec",
        "type": "stat"
      },
         {
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "description": "Number of partitions that don’t have an active leader and are hence not writable or readable. Alert if value is greater than 0.",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "#299c46",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 1
                  },
                  {
                    "color": "#d44a3a",
                    "value": 1
                  }
                ]
              },
              "unit": "none"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 3,
            "y": 1
          },
          "id": 15,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "value",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "textMode": "auto"
          },
          "pluginVersion": "9.5.2",
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "sum(kafka_controller_offlinepartitionscount{env=\\"$env\\"})",
              "format": "time_series",
              "instant": false,
              "intervalFactor": 1,
              "legendFormat": "",
              "refId": "A"
            }
          ],
          "title": "Offline Partitions Count",
          "type": "stat"
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "description": "Number of under-replicated partitions (| ISR | < | all replicas |). Alert if value is greater than 0.",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "#299c46",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 1
                  },
                  {
                    "color": "#d44a3a",
                    "value": 1
                  }
                ]
              },
              "unit": "none"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 7,
            "y": 1
          },
          "id": 16,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "value",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "textMode": "auto"
          },
          "pluginVersion": "9.5.2",
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "sum(kafka_server_replica_manager_underreplicatedpartitions{env=\\"$env\\"})",
              "format": "time_series",
              "instant": false,
              "intervalFactor": 1,
              "legendFormat": "",
              "refId": "A"
            }
          ],
          "title": "Under Replicated Partitions",
          "type": "stat"
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "description": "Number of under-replicated partitions (| ISR | < | min.insync.replicas  |). Alert if value is greater than 0.",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "#299c46",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 1
                  },
                  {
                    "color": "#d44a3a",
                    "value": 1
                  }
                ]
              },
              "unit": "none"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 11,
            "y": 1
          },
          "id": 17,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "value",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "textMode": "auto"
          },
          "pluginVersion": "9.5.2",
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "sum(kafka_cluster_partition_underminisr{env=\\"$env\\"})",
              "format": "time_series",
              "instant": true,
              "intervalFactor": 1,
              "legendFormat": "",
              "refId": "A"
            }
          ],
          "title": "Partitions Under Min ISR",
          "type": "stat"
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 6,
            "w": 12,
            "x": 12,
            "y": 38
          },
          "hiddenSeries": false,
          "id": 18,
          "isNew": true,
          "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "9.5.2",
          "pointradius": 2,
          "points": true,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": true,
          "steppedLine": false,
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "kafka_server_replica_manager_partitioncount{env=\\"$env\\"}",
              "format": "time_series",
              "intervalFactor": 2,
              "legendFormat": "Broker={{instance}}",
              "metric": "kafka_server_replication_leadercount",
              "refId": "A",
              "step": 10
            }
          ],
          "thresholds": [],
          "timeRegions": [],
          "title": "Number of Partitions Per Broker",
          "tooltip": {
            "msResolution": false,
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "mode": "time",
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "none",
              "logBase": 1,
              "min": 0,
              "show": true
            },
            {
              "format": "short",
              "logBase": 1,
              "show": true
            }
          ],
          "yaxis": {
            "align": false
          }
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "description": "Number of leaders on each broker. This should be mostly even across all brokers. If not, set auto.leader.rebalance.enable to true on all brokers in the cluster.",
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 6,
            "w": 12,
            "x": 0,
            "y": 38
          },
          "hiddenSeries": false,
          "id": 19,
          "isNew": true,
          "legend": {
            "alignAsTable": false,
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "9.5.2",
          "pointradius": 2,
          "points": true,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": true,
          "steppedLine": false,
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "kafka_server_replica_manager_leadercount{env=\\"$env\\"}",
              "format": "time_series",
              "instant": false,
              "intervalFactor": 2,
              "legendFormat": "Broker={{instance}}",
              "metric": "kafka_server_replication_leadercount",
              "refId": "A",
              "step": 10
            }
          ],
          "thresholds": [],
          "timeRegions": [],
          "title": "Leader Count Per Broker",
          "tooltip": {
            "msResolution": false,
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "mode": "time",
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "none",
              "logBase": 1,
              "min": 0,
              "show": true
            },
            {
              "format": "short",
              "logBase": 1,
              "show": true
            }
          ],
          "yaxis": {
            "align": false
          }
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": {
            "type": "prometheus",
            "uid": "PBFA97CFB590B2093"
          },
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 7,
            "w": 12,
            "x": 12,
            "y": 31
          },
          "hiddenSeries": false,
          "id": 20,
          "isNew": true,
          "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "9.5.2",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "datasource": {
                "type": "prometheus",
                "uid": "PBFA97CFB590B2093"
              },
              "expr": "kafka_controller_stats_uncleanleaderelectionspersec{aggregate=\\"OneMinuteRate\\",env=\\"$env\\"}",
              "format": "time_series",
              "intervalFactor": 2,
              "legendFormat": "Broker={{instance}} / {{aggregate}}",
              "metric": "kafka_controller_stats_unclean_leader_elections_per_sec",
              "refId": "A",
              "step": 10
            }
          ],
          "thresholds": [],
          "timeRegions": [],
          "title": "Unclean Leader Election Rate",
          "tooltip": {
            "msResolution": false,
            "shared": true,
            "sort": 0,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "mode": "time",
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "decimals": 0,
              "format": "short",
              "logBase": 1,
              "min": 0,
              "show": true
            },
            {
              "format": "short",
              "logBase": 1,
              "min": 0,
              "show": true
            }
          ],
          "yaxis": {
            "align": false
          }
        }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "timepicker": {
      "refresh_intervals": [
        "5s",
        "10s",
        "30s",
        "1m",
        "5m",
        "15m",
        "30m",
        "1h",
        "2h",
        "1d"
      ],
      "time_options": [
        "5m",
        "15m",
        "1h",
        "6h",
        "12h",
        "24h",
        "2d",
        "7d",
        "30d"
      ]
    },
    "timezone": "browser",
    "title": "Kafka Cluster / Global HealthCheck",
    "uid": "e-6AJQOik",
    "version": 4,
    "weekStart": ""
  }
  `);
}