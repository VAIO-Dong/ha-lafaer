"""Config flow for Lafaer."""

from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import CONF_DEBUG_PERSIST, DEFAULT_DEBUG_PERSIST, DOMAIN, NAME


class LafaerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create the singleton Lafaer controller entry."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None) -> FlowResult:
        """Handle setup initiated by a user."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title=NAME, data={})

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> LafaerOptionsFlow:
        """Return the options flow."""
        return LafaerOptionsFlow(config_entry)


class LafaerOptionsFlow(config_entries.OptionsFlow):
    """Configure local diagnostic recording."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._config_entry = config_entry

    async def async_step_init(self, user_input: dict | None = None) -> FlowResult:
        """Manage integration options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_DEBUG_PERSIST,
                    default=self._config_entry.options.get(
                        CONF_DEBUG_PERSIST, DEFAULT_DEBUG_PERSIST
                    ),
                ): bool
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
