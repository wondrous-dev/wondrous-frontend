# Source Control

Wonder users may utilize whatever Source Control website they desire. Thus, Wonder needs
a general suite of Source Control tools which give GitHub based projects the same consistent
functionality of BitBucket projects. This library provides generic interfaces which outline
the basic behaviors we expect of each Source Control integration. Thus, we can develop
Wonder functionality using this library and in the future connect more and more Source
Control websites as requested by our users.

## Syncing Logic

The simplest model would for the SourceControl to be mirrored within Wonder and function as
a read-only source of truth. However, as stated in `Task.ts`, we imagine certain writes which
will originate from Wonder --> SourceControl. Thus, we need to make sure the two are in sync
such that writes are not lost and writes happen against the most up to date state in the
SourceControl (source of truth).

Currently, the only write is UpdateLabel, where a task's status is updated on the Wonder side
and the change is pushed to the SourceControl side.

While we will have some logic to "watch" for changes in the SourceControl, and mirror those
changes to Wonder, we also need to periodically force syncing since the two could drift
between SourceControl updates.

In pseudocode:

```
1. query all projects in your flavor of SourceControl (i.e. GitHub)
2. for each project in (1), SyncProjectWithWonder
```

This will be running on a loop every X seconds or Y minutes, whatever we feel is ok
and whatever doesn't violate the API limitations of said SourceControl.

## Testing

The tests for this code live in `tests/SourceControl-General-Tests`. Invoke them by:

```
yarn test
```

## Formatting and Linting

Each of these have their own script:

```
yarn format

yarn lint
```
