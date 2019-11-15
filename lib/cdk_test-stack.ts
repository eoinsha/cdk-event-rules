import cdk = require('@aws-cdk/core');

import events = require('@aws-cdk/aws-events');
import logs = require('@aws-cdk/aws-logs');
import { IRuleTarget } from '@aws-cdk/aws-events';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'testLogGroup', {
      logGroupName: 'events-test-log-group'
    })

    new events.Rule(this, 'testRule', {
      ruleName: 'aws-test-rule',
      eventPattern: {
        source: ['aws.batch'],
        detailType: ['Batch Job State Change']
      },
      targets: [new LogTarget(logGroup.logGroupArn)]
    })
    // The code that defines your stack goes here
  }
}

class LogTarget implements IRuleTarget {

  arn: string

  constructor(arn: string) {
    this.arn = arn
  }

  bind(rule: events.IRule, id: string) {
    return {
      id: id,
      arn: this.arn
    }
  }
}