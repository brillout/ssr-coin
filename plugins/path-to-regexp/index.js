const routerFile = require.resolve('./router');
const {config, AppendArray} = require('@brillout/reconfig');

Object.assign(
  config,
  {
    routerFile,
    browserConfigs: AppendArray(['routerFile']),
  },
);

    /*
    ejectables: [
        {
            name: 'router',
            description: 'Eject the `@reframe/path-to-regepx` router.',
            actions: [
                {
                    targetDir: 'router/',
                    configIsFilePath: true,
                    configPath: 'routerFile',
                },
            ],
        },
    ],
    */
