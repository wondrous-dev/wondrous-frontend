# Source Control

Wonder users may utilize whatever Source Control website they desire. Thus, Wonder needs
a general suite of Source Control tools which give GitHub based projects the same consistent
functionality of BitBucket projects. This library provides generic interfaces which outline
the basic behaviors we expect of each Source Control integration. Thus, we can develop
Wonder functionality using this library and in the future connect more and more Source
Control websites as requested by our users.

## Testing

The tests for this code live in `tests/SourceControl-General-Tests`. Invoke them by:

```bash
yarn test
```

## Formatting and Linting

Each of these have their own script:

```bash
yarn format

yarn lint
```
