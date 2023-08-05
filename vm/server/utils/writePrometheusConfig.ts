interface Targets {
  broker: String,
  jmx_hostname: String,
  jmx_port_number: String,
};

export default (targets: Targets) => {
  const targetsString = JSON.stringify(targets);
  return (`
    global:
      scrape_interval: 3s
    
    rule_files:
    
    scrape_configs:
      - job_name: "kafka-sonar"
    
        static_configs:
          - targets: ${targetsString}`
  );
};