from __future__ import annotations

from concurrent.futures import Future, ThreadPoolExecutor
from typing import Any, Callable


class BackgroundTaskRunner:
    def __init__(self, max_workers: int = 2, enabled: bool = True) -> None:
        self.enabled = enabled
        self._executor = ThreadPoolExecutor(max_workers=max_workers) if enabled else None

    def submit(self, func: Callable[..., Any], *args, **kwargs) -> Any:
        if not self.enabled or self._executor is None:
            return func(*args, **kwargs)
        future: Future = self._executor.submit(func, *args, **kwargs)
        return future

    def shutdown(self) -> None:
        if self._executor:
            self._executor.shutdown(wait=False)
