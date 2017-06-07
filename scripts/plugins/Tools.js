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
      select.html('');
      unitData.forEach((unit) => {
        if (unit.canEquip(toolName)) {
          const unitId = ucfirst(unit.id);
          select.append(`<option data-name="${unit.id}">${unitId}</option>`);
        }
      });
    }
  }

  /**
   * Run when user click "Equip" in tools
   * equipment view.
   */
  equip() {
    const toolName = this.getToolName();
    const unitName = this.getUnitName();

    if (toolName == null || unitName == null) {
      // User did not select anything.
    } else {
      //
    }
  }

  /**
   * Run when user click "Unequip" in tools
   * equipment view.
   */
  unequip() {
  }

  /**
   * Get selected tool name.
   * @return {string|null}
   */
  getToolName() {
    const toolNames = $('#tools-equip-available option:selected');
    if (toolNames.length === 0) {
      return null;
    } else {
      const toolName = $(toolNames[0]).data('name');
      return toolName;
    }
  }

  /**
   * Get selected unit name.
   * @return {string|null}
   */
  getUnitName() {
    const unitNames = $('#tools-equip-units option:selected');
    if (unitNames.length === 0) {
      return null;
    } else {
      const unitName = $(unitNames[0]).data('name');
      return unitName;
    }
  }

  /**
   * Update equip/unequip buttons.
   */
  onEquipChange() {
    const toolName = this.getToolName();
    const unitName = this.getUnitName();

    if (toolName == null || unitName == null) {
      // Disable buttons.
      $('#tools-equip-equip').attr('disabled', 'disabled');
      $('#tools-equip-unequip').attr('disabled', 'disabled');
    } else {
      // Check if you can equip/unequip.
      const unit = civData[unitName];
      const tool = civData[toolName];

      if (unit == null) {
        throw 'Found no unit with name ' + unitName;
      }

      if (tool == null) {
        throw 'Found no tool with name ' + toolName;
      }

      // Check if unit can equip this tool.
      if (unit.canEquip(tool)) {
        $('#tools-equip-equip').removeAttr('disabled');
      } else {
        $('#tools-equip-equip').attr('disabled', 'disabled');
      }

      // Check if unit can unequip this tool.
      if (unit.canUnequip(tool)) {
        $('#tools-equip-unequip').removeAttr('disabled');
      } else {
        $('#tools-equip-unequip').attr('disabled', 'disabled');
      }

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
