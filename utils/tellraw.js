class Tellraw {
  constructor(target, components, prefixEnabled = true) {
    this.target = target;
    this.prefixEnabled = prefixEnabled;
    this.components = components || [];
  }

  add(component) {
    if (Array.isArray(component)) {
      component.forEach(c => this.add(c));
      return this;
    }

    if (component != null) {
      this.components.push(component);
    }

    return this;
  }

  get() {
    const components = this.components.map(component => {
      if (typeof component === 'string') {
        return { text: component };
      } else {
        return component.get();
      }
    });

    if (this.prefixEnabled) {
      const prefix = [
        { text: '[', color: '#1C1C1B' },
        { text: 'SC09-Core', color: '#474747' },
        { text: '] \u203a ', color: '#1C1C1B' }
      ];

      // Concatenate the prefix and text components
      const finalComponents = prefix.concat(components);

      return `tellraw ${this.target} ${JSON.stringify(finalComponents)}`;
    } else {
      return `tellraw ${this.target} ${JSON.stringify(components)}`;
    }
  }
}

class Text {
  constructor(text) {
    this.text = text || '';
    this.color = null;
    this.bold = null;
    this.italic = null;
    this.underlined = null;
    this.strikethrough = null;
    this.obfuscated = null;
    this.clickEvent = null;
    this.hoverEvent = null;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setBold(bold) {
    this.bold = bold;
    return this;
  }

  setItalic(italic) {
    this.italic = italic;
    return this;
  }

  setUnderlined(underlined) {
    this.underlined = underlined;
    return this;
  }

  setStrikethrough(strikethrough) {
    this.strikethrough = strikethrough;
    return this;
  }

  setObfuscated(obfuscated) {
    this.obfuscated = obfuscated;
    return this;
  }

  setClickEvent(action, value) {
    this.clickEvent = { action, value };
    return this;
  }

  setHoverEvent(action, value) {
    this.hoverEvent = { action, value };
    return this;
  }

  setCommand(command) {
    this.clickEvent = { action: "run_command", value: command };
    return this;
  }

  setHover(hover) {
    this.hoverEvent = { action: "show_text", value: hover };
    return this;
  }

  setURL(url) {
    this.clickEvent = { action: "open_url", value: url };
    return this;
  }

  setSuggestedCommand(command) {
    this.clickEvent = { action: "suggest_command", value: command };
    return this;
  }

  setCopy(text) {
    this.clickEvent = { action: "copy_to_clipboard", value: text };
    return this;
  }

  get() {
    let obj = { text: this.text };
    if (this.color) obj.color = this.color;
    if (this.bold !== null) obj.bold = this.bold;
    if (this.italic !== null) obj.italic = this.italic;
    if (this.underlined !== null) obj.underlined = this.underlined;
    if (this.strikethrough !== null) obj.strikethrough = this.strikethrough;
    if (this.obfuscated !== null) obj.obfuscated = this.obfuscated;
    if (this.clickEvent) obj.clickEvent = this.clickEvent;
    if (this.hoverEvent) obj.hoverEvent = this.hoverEvent;
    return obj;
  }
}

module.exports = { Tellraw, Text };
