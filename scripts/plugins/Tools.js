/* @flow */
'use strict';

/**
 * Plugin for all tools related and tools page.
 * @property object tickSub
 * @property string toolsRowTemplate
 * @property array availableTools
 */
CivClicker.plugins.Tools = new (class ToolsPlugin {

  constructor() {
    this.tickSub = null;
    this.toolsRowTemplate = null;
    this.availableTools = [];

    $.get('templates/toolsTableRow.html', (template) => {
      this.toolsRowTemplate = template;
    });

  }

  /**
   * Render tools table.
   */
  renderTable() {
    const $table = $('#toolsTable');
    $table.html('');

    tools.forEach((tool) => {
      if (meetsPrereqs(tool)) {
        this.availableTools.push(tool);
      }
    });
    this.availableTools.forEach((tool) => {
      const s = Mustache.to_html(
        this.toolsRowTemplate,
        {
          tool: tool,
          owned: civData[tool.name].owned,
          cost: getCostNote(tool),
          ucfirst: () => {
            return (s, render) => {
              let rendered = render(s);
              return rendered.charAt(0).toUpperCase() + rendered.slice(1);
            };
          }
        }
      );
      $table.append(s);
    });

  }

  /**
   * Update amount of tools owned in tool table.
   */
  updateAmount() {
    this.availableTools.forEach((tool) => {
      const owned = civData[tool.name].owned;
      const selector = `.tool-${tool.name}-owned`;
      $(selector).html(owned);
    });
  }

  /**
   * Unemployed.
   */
  updateIdleCitizens() {
    $('#tools-idle-citizens').html(civData.unemployed.owned);
  }

  /**
   * Update the equip table.
   */
  updateEquip() {
    this.populateEquipAvailable();
    this.populateEquipUnits();
    $('#tools-equip-available option').on('click', () => {
      this.populateEquipUnits();
    });
  }

  /**
   * Tools available for equipment.
   */
  populateEquipAvailable() {
    const select = $('#tools-equip-available');
    select.html('');
    tools.forEach((tool) => {
      const name = ucfirst(tool.name);
      const amount = tool.owned;
      select.append(`<option data-name="${tool.name}">${name} (${amount})</option>`);
    });
  }

  /**
   * List of units available for equipment.
   */
  populateEquipUnits() {
    const activeTool = $('#tools-equip-available option:selected');
    if (activeTool.length === 0) {
      // Do nothing
    } else {
      const option = activeTool[0];
      const toolName = $(option).data('name');
      const select = $('#tools-equip-units');
      unitData.forEach((unit) => {
        if (unit.canEquip.indexOf(toolName) !== -1) {
          const unitId = ucfirst(unit.id);
          select.append(`<option>${unitId}</option>`);
        }
      });
    }
  }

  /**
   * Init plugin.
   */
  init() {
    this.renderTable();
    this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
      this.updateAmount();
      this.updateIdleCitizens();
    });
  }

  /**
   * Unload plugin.
   */
  unload() {
    if (this.tickSub) {
      this.tickSub.remove();
    }
  }
});
