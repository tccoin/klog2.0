import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const LicenseMixin = (superClass) => class extends superClass {
  get licenseList() {
    return [
      { "name": "all-rights-reserved", "abbreviation": "All Rights Reserved", "en": "All Rights Reserved", "zh": "保留所有权力", "description": "版权所有，不得转载。", icon: ["all"] },
      { "name": "cc0", "abbreviation": "No Rights Reserved", "en": "CC0 1.0 Universal", "zh": "CC0 1.0 通用 公共领域贡献", "description": "本作品通过<a rel=\"license\" href=\"https://creativecommons.org/publicdomain/zero/1.0/deed.zh\">CC0</a>贡献给公共领域。", icon: ["zero"] },
      { "name": "by", "abbreviation": "CC BY 4.0", "en": "Attribution 4.0 International", "zh": "知识共享署名 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by/4.0/deed.zh\">CC BY 4.0</a>进行许可。", icon: ["by"] },
      { "name": "by-nd", "abbreviation": "CC BY-ND 4.0", "en": "Attribution-NoDerivatives 4.0 International", "zh": "知识共享署名-禁止演绎 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-nd/4.0/deed.zh\">CC BY-ND 4.0</a>进行许可。", icon: ["by", "nd"] },
      { "name": "by-sa", "abbreviation": "CC BY-SA 4.0", "en": "Attribution-ShareAlike 4.0 International", "zh": "知识共享署名-相同方式共享 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/deed.zh\">CC BY-SA 4.0</a>进行许可。", icon: ["by", "sa"] },
      { "name": "by-nc", "abbreviation": "CC BY-NC 4.0", "en": "Attribution-NonCommercial 4.0 International", "zh": "知识共享署名-非商业性使用 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-nc/4.0/deed.zh\">CC BY-NC 4.0</a>进行许可。", icon: ["by", "nc"] },
      { "name": "by-nc-nd", "abbreviation": "CC BY-NC-ND 4.0", "en": "Attribution-NonCommercial-NoDerivatives 4.0 International", "zh": "知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh\">CC BY-NC-ND 4.0</a>进行许可。", icon: ["by", "nc", "nd"] },
      { "name": "by-nc-sa", "abbreviation": "CC BY-NC-SA 4.0", "en": "Attribution-NonCommercial-ShareAlike 4.0 International", "zh": "知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议", "description": "本作品采用<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh\">CC BY-NC-SA 4.0</a>进行许可。", icon: ["by", "nc", "sa"] }
    ]
  }
  get fullLicenseList() {
    return this.licenseList.concat([
      { "name": "not-mine", "abbreviation": "转载文章", "en": "Not Mine", "zh": "转载文章", "description": "本作品系转载，版权归属于原作者。", icon: [] },
      { "name": "default", "abbreviation": "账户默认", "en": "default", "zh": "账户默认", "description": "账户默认", icon: [] }
    ]);
  }
  get licenseIconList() {
    return {
      "all": { "title": "保留所有权利", "description": "著作权持有人保留著作权法规定的所有权利。" },
      "zero": { "title": "无著作权 (CC0)", "description": "您可以复制、修改、发行和表演本作品，甚至可用于商业性目的，都无需要求同意。" },
      "by": { "title": "署名 (BY)", "description": "您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否对原始作品作了修改。" },
      "nc": { "title": "非商业性使用 (NC)", "description": "您不得将本作品用于商业目的。" },
      "sa": { "title": "相同方式共享 (SA)", "description": "如果您再混合、转换或者基于本作品进行创作，您必须基于与原先许可协议相同的许可协议分发您贡献的作品。" },
      "nd": { "title": "禁止演绎 (ND)", "description": "如果您再混合、转换、或者基于该作品创作，您不可以分发修改作品。" },
    }
  }
}

export const KlogDataLicenseMixin = dedupingMixin(LicenseMixin);