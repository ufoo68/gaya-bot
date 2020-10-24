import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as GayaBot from '../lib/gaya-bot-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new GayaBot.GayaBotStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
