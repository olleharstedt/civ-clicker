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
      console.log('missing selection');
      this.onEquipChange();
    } else {
      //
      console.log('toolName', toolName);
      console.log('unitName', unitName);

      const unit = civData[unitName];
      const tool = civData[toolName];
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
    // Check if unit can equip this tool.
    if (this.canEquipSelected()) {
      $('#tools-equip-equip').removeAttr('disabled');
    } else {
      $('#tools-equip-equip').attr('disabled', 'disabled');
    }

    // Check if unit can unequip this tool.
    if (this.canUnequipSelected()) {
      $('#tools-equip-unequip').removeAttr('disabled');
    } else {
      $('#tools-equip-unequip').attr('disabled', 'disabled');
    }
  }

  /**
   * Returns true if selected unit can equip selected tool.
   * @return bool
   * @throws Exception if unit/tool name is invalid (not in civData).
   */
  canEquipSelected() {
    const unit = this.getSelectedUnit();
    const tool = this.getSelectedTool();

    if (unit && tool) {
      return unit.canEquip(tool);
    } else {
      return false;
    }
  }

  /**
   * Returns true if selected unit can unequip selected tool.
   * @return bool
   * @throws Exception if unit/tool name is invalid (not in civData).
   */
  canUnequipSelected() {
    const unit = this.getSelectedUnit();
    const tool = this.getSelectedTool();

    if (unit && tool) {
      return unit.canUnequip(tool);
    } else {
      return false;
    }
  }

  /**
   * @return {Tool|null}
   */
  getSelectedTool() {
    const toolName = this.getToolName();
    if (toolName == null) {
      return null;
    } else {
      const tool = civData[toolName];
      if (tool == null) {
        throw 'Found no tool with name ' + toolName;
      }
      return tool;
    }
  }

  /**
   * @return {Unit|null}
   */
  getSelectedUnit() {
    const unitName = this.getUnitName();
    if (unitName == null) {
      return null;
    } else {
      const unit = civData[unitName];
      if (unit == null) {
        throw 'Found no unit with name ' + unitName;
      }
      return unit;
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
