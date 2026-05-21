<template>
  <div class="wiki-view" @click="onImageClick">
    <!-- 右侧导航 -->
    <div class="side-nav" :class="{ collapsed: isNavCollapsed }">
      <button class="toggle-btn" @click="toggleNav" :title="isNavCollapsed ? '展开导航' : '收起导航'">
        {{ isNavCollapsed ? '◀' : '▶' }}
      </button>
      <div class="nav-content">
        <!-- 一级：基础资料 -->
        <button class="nav-btn nav-l1" :class="{ expanded: navExpanded === 'basic' }" @click="toggleNavGroup('basic')">基础资料</button>
        <div class="nav-l2-group" v-show="navExpanded === 'basic'">
          <button class="nav-btn nav-l2" @click="scrollTo('other-info')">其他信息</button>
          <button class="nav-btn nav-l2" @click="scrollTo('stats')">角色统计</button>
          <button class="nav-btn nav-l2" @click="scrollTo('battle-style')">战斗风格</button>
          <button class="nav-btn nav-l2" @click="scrollTo('skill-desc')">技能说明</button>
        </div>
        <!-- 一级：角色养成 -->
        <button class="nav-btn nav-l1" :class="{ expanded: navExpanded === 'build' }" @click="toggleNavGroup('build')">角色养成</button>
        <div class="nav-l2-group" v-show="navExpanded === 'build'">
          <button class="nav-btn nav-l2" @click="scrollTo('skill-intro')">技能介绍</button>
          <button class="nav-btn nav-l2" @click="scrollTo('resonance-chain')">共鸣链</button>
          <button class="nav-btn nav-l2" @click="scrollTo('breakthrough-materials')">角色突破材料</button>
          <button class="nav-btn nav-l2" @click="scrollTo('skill-materials')">技能突破材料</button>
        </div>
        <!-- 一级：角色档案 -->
        <button class="nav-btn nav-l1" :class="{ expanded: navExpanded === 'archive' }" @click="toggleNavGroup('archive')">角色档案</button>
        <div class="nav-l2-group" v-show="navExpanded === 'archive'">
          <button class="nav-btn nav-l2" @click="scrollTo('ability-report')">共鸣能力鉴定报告</button>
          <button class="nav-btn nav-l2" @click="scrollTo('precious-items')">珍贵之物</button>
          <button class="nav-btn nav-l2" @click="scrollTo('character-story')">角色故事</button>
        </div>
        <!-- 一级：角色攻略 -->
        <button class="nav-btn nav-l1" :class="{ expanded: navExpanded === 'guide' }" @click="toggleNavGroup('guide')">角色攻略</button>
        <div class="nav-l2-group" v-show="navExpanded === 'guide'">
          <button class="nav-btn nav-l2" @click="scrollTo('guide-battle-style')">战斗风格</button>
          <button class="nav-btn nav-l2" @click="scrollTo('guide-build')">角色养成</button>
          <button class="nav-btn nav-l2" @click="scrollTo('guide-mechanics')">角色机制</button>
          <button class="nav-btn nav-l2" @click="scrollTo('guide-echo')">声骸套装推荐</button>
          <button class="nav-btn nav-l2" @click="scrollTo('guide-weapon')">武器推荐</button>
          <button class="nav-btn nav-l2" @click="scrollTo('guide-team')">编队&队伍轴推荐</button>
        </div>
        <button class="nav-btn top-btn" @click="scrollTo('top')" title="返回顶部">▲</button>
      </div>
    </div>

    <!-- 顶部 Banner -->
    <div id="top" class="banner-section" :style="{ backgroundImage: `url(${currentBanner})` }">
      <!-- 大标题 -->
      <div class="wiki-hero">
        <h1 class="wiki-title">wiki-DENIA</h1>
        <p class="wiki-subtitle">数据来自官方库街区，解释权归其所有，感谢各位贡献者！</p>
      </div>
      <div class="banner-actions">
        <button class="banner-btn" @click="scrollTo('basic-info')">基础资料</button>
        <button class="banner-btn" @click="scrollTo('skill-intro')">角色养成</button>
        <button class="banner-btn" @click="scrollTo('character-guide')">角色攻略</button>
        <button class="banner-btn" @click="scrollTo('character-archive')">角色档案</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-section">
      <!-- 模块：基础资料 -->
      <div id="basic-info" class="module glass-panel">
        <h2 class="module-title">基础资料</h2>

        <!-- 角色展示组件 -->
        <div class="role-component">
          <div class="role-wrapper">
            <div class="role-bg" :style="{ backgroundImage: `url(${roleBg})` }"></div>
            <div class="role-content">
              <!-- 角色立绘切换 -->
              <div class="role-images">
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 0 }">
                  <img :src="roleImages[0]" alt="达妮娅" />
                </div>
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 1 }">
                  <img :src="roleImages[1]" alt="编队立绘" />
                </div>
                <div class="figure" :class="{ 'figure-visible': activeImageTab === 2 }">
                  <img :src="roleImages[2]" alt="海报立绘" />
                </div>
              </div>
              <!-- 角色信息 -->
              <div class="role-profile">
                <div class="main-info">
                  <img class="attr-icon" :src="attrIcon" alt="热熔" />
                  <div class="name-block">
                    <h2 class="name">达妮娅</h2>
                    <div class="name-en">DENIA</div>
                  </div>
                </div>
                <img class="hr-line" src="https://wiki.kurobbs.com/resource/wiki/prod/assets/profile-hr-line-8e485eed.png" alt="" />
                <div class="lore-block">
                  <h3 class="lore-title">共鸣能力：泡影视阈</h3>
                  <p class="lore-desc">星炬学院虚质科学部学生，终日懒散摸鱼打瞌睡。 出席过绝大多数学生活动，常用"温柔"的笑容面对大家。</p>
                </div>
                <div class="tags-block">
                  <span class="tag">性别：女</span>
                  <span class="tag">出生：█ █</span>
                  <span class="tag">武器：音感仪</span>
                  <span class="tag">属性：热熔</span>
                </div>
              </div>
              <!-- 立绘切换标签 -->
              <div class="role-tabs">
                <div class="role-tab" :class="{ active: activeImageTab === 0 }" @click="activeImageTab = 0">
                  <span>基础信息</span>
                </div>
                <div class="role-tab" :class="{ active: activeImageTab === 1 }" @click="activeImageTab = 1">
                  <span>编队立绘</span>
                </div>
                <div class="role-tab" :class="{ active: activeImageTab === 2 }" @click="activeImageTab = 2">
                  <span>海报立绘</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div id="other-info" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('otherInfo')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">其他信息</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.otherInfo">
            <table class="info-table">
              <colgroup><col style="width:35%"/><col style="width:65%"/></colgroup>
              <tbody>
                <tr><td class="label-cell">身份</td><td class="value-cell">星炬学院虚质科学部学生</td></tr>
                <tr><td class="label-cell">所属</td><td class="value-cell"><s>残星会</s></td></tr>
                <tr><td class="label-cell">特殊料理</td><td class="value-cell"><a href="https://wiki.kurobbs.com/mc/item/1498831545168896000" target="_blank">夺目甜蜜</a></td></tr>
                <tr><td class="label-cell">中文CV</td><td class="value-cell">戈昕宇</td></tr>
                <tr><td class="label-cell">日文CV</td><td class="value-cell">伊藤美来</td></tr>
                <tr><td class="label-cell">英文CV</td><td class="value-cell">Jodie Bell Cortez</td></tr>
                <tr><td class="label-cell">韩文CV</td><td class="value-cell">Park Si Yoon</td></tr>
                <tr><td class="label-cell">实装版本</td><td class="value-cell">V3.3</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 角色统计 -->
        <div id="stats" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('stats')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '100px 0' }"></div>
            <div class="component-header-content">
              <span class="component-title-text">角色统计</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.stats">
            <div class="stat-tabs">
              <button v-for="(tab, i) in statTabs" :key="i" class="stat-tab" :class="{ active: activeStatTab === i }" @click="activeStatTab = i">{{ tab }}</button>
            </div>
            <div class="stat-table-wrapper">
              <table class="info-table" v-for="(table, idx) in statTables" :key="idx" v-show="activeStatTab === idx">
                <colgroup><col style="width:22%"/><col style="width:17.5%"/><col style="width:17%"/><col style="width:22%"/><col style="width:21.5%"/></colgroup>
                <tbody>
                  <tr v-for="(row, r) in table" :key="r">
                    <td class="label-cell" v-for="(cell, c) in row" :key="c" v-html="cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 战斗风格 -->
        <div id="battle-style" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('battleStyle')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">战斗风格</span>
              <button class="collapse-btn" :class="{ active: collapseState.battleStyle }">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.battleStyle">
            <table class="info-table battle-table">
              <colgroup><col style="width:15%"/><col style="width:85%"/></colgroup>
              <tbody>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/5210f30d97eb4ca89bc04c9ee250c7c320240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>快速协奏</strong><br/>拥有较高的协奏效率</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/46fe60eb92b14b938f5d1c5d680bcd1120240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>共鸣解放伤害</strong><br/>共鸣解放伤害较高</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/cebc386f602a449d9f8d9b5dfd82883f20240802.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>牵引</strong><br/>可以将一定范围内的目标牵引至特定位置</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/4346b8fb96724ccf81fe4ef3efd4d9cc20241231.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>聚爆</strong><br/>可以运用聚爆效应</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/160e04c923dc47c3830e9995c988436a20251224.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>谐度破坏增幅</strong><br/>可以提升队伍内特定角色的谐度破坏增幅</td>
                </tr>
                <tr>
                  <td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/9c35ab37748247348157ab393672103720251224.png" width="64" alt="" /></td>
                  <td class="value-cell"><strong>集谐响应</strong><br/>根据自身谐度破坏增幅对目标造成最终伤害提升</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 技能说明 -->
        <div id="skill-desc" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('skillDesc')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">技能说明</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.skillDesc">
            <div class="skill-images">
              <img src="https://prod-alicdn-community.kurobbs.com/forum/e7e57820c5c94bb8b82772c4b09a0ee220260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/bc7fb2409beb438db14739e59584a9e520260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/bbe10d75dc8a4d0291b45a338f49ea7520260520.jpg" alt="" class="skill-img" />
              <img src="https://prod-alicdn-community.kurobbs.com/forum/855415bf5d9c499287860afbbb613a9e20260520.jpg" alt="" class="skill-img" />
            </div>
            <hr class="skill-divider" />
            <div class="skill-energy">
              <p><strong>特殊能量</strong></p>
              <p>· 处于【<span class="text-gold">布景之形</span>】时，攻击可获得【<span class="text-gold">虚质粒子</span>】。</p>
              <p>· 处于【<span class="text-gold">幻灭之形</span>】时，攻击可消耗【<span class="text-gold">虚质粒子</span>】转化为【<span class="text-gold">共形能量</span>】，为【<span class="text-gold">帷幕终景·幻灭之形</span>】充能。</p>
              <p>· 处于<span class="text-gold">熵变强化</span>状态时，随时间获得【<span class="text-gold">黯核</span>】，可用于释放强化共鸣技能。</p>
              <p>· 释放<span class="text-gold">共鸣解放·布景之形</span>，达妮娅会获得<span class="text-gold">熵变强化·幻灭之形</span>，提升攻击。 释放<span class="text-gold">共鸣解放·幻灭之形</span>，达妮娅会获得<span class="text-gold">熵变强化·布景之形</span>，持续回复【<span class="text-gold">虚质粒子</span>】。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块：角色养成 -->
      <div id="skill-intro" class="module glass-panel">
        <h2 class="module-title">角色养成</h2>

        <!-- 技能介绍 -->
        <div class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('skillIntro')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '97px 0' }"></div>
            <div class="component-header-content">
              <span class="component-title-text">技能介绍</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.skillIntro">
            <div class="skill-tabs">
              <button v-for="(tab, i) in skillTabs" :key="i" class="skill-tab" :class="{ active: activeSkillTab === i }" @click="activeSkillTab = i">{{ tab }}</button>
            </div>

            <!-- 常态攻击 -->
            <div class="skill-content" v-show="activeSkillTab === 0">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/16b01ea017a048f8a88a9fd3a0dd6e9f20250720.png" width="91" alt="" />
                <h3 class="skill-name">织梦的飨宴</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">普攻·布景之形</strong><br/>进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">普攻·幻灭之形</strong><br/>进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">重击·布景之形</strong><br/>消耗耐力，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">重击·幻灭之形</strong><br/>消耗耐力，牵引周围的目标，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中攻击·布景之形</strong><br/>消耗耐力进行空中下落攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中攻击·幻灭之形</strong><br/>消耗耐力，在空中进行最多4段的连续攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">空中重击·幻灭之形</strong><br/>在空中长按<span class="text-gold">普攻</span>，消耗耐力进行空中下落攻击，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">闪避反击·布景之形</strong><br/>成功闪避后一定时间内短按<span class="text-gold">普攻</span>，将会攻击目标，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·布景之形第4段</span>。</p>
                <p><strong class="text-gold">闪避反击·幻灭之形</strong><br/>成功闪避后一定时间内短按<span class="text-gold">普攻</span>，将会攻击目标，造成<span class="text-red">热熔伤害</span>。<br/>可在空中施放。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·幻灭之形第4段</span>/<span class="text-gold">空中攻击·幻灭之形第4段</span>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/692daaf9ac574b14a8fd8b998bc331d820250209.png" width="91" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升2.40%</p></td>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升5.60%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>普攻·布景之形第一段伤害</td><td>16.44%</td><td>17.79%</td><td>19.14%</td><td>21.03%</td><td>22.38%</td><td>23.93%</td><td>26.08%</td><td>28.24%</td><td>30.40%</td><td>32.69%</td></tr>
                      <tr><td>普攻·布景之形第二段伤害</td><td>15.18%*2</td><td>16.43%*2</td><td>17.67%*2</td><td>19.42%*2</td><td>20.66%*2</td><td>22.09%*2</td><td>24.09%*2</td><td>26.08%*2</td><td>28.07%*2</td><td>30.18%*2</td></tr>
                      <tr><td>普攻·布景之形第三段伤害</td><td>12.82%*3</td><td>13.88%*3</td><td>14.93%*3</td><td>16.40%*3</td><td>17.45%*3</td><td>18.66%*3</td><td>20.34%*3</td><td>22.02%*3</td><td>23.71%*3</td><td>25.49%*3</td></tr>
                      <tr><td>普攻·布景之形第四段伤害</td><td>64.38%</td><td>69.66%</td><td>74.94%</td><td>82.33%</td><td>87.61%</td><td>93.68%</td><td>102.13%</td><td>110.58%</td><td>119.02%</td><td>128.00%</td></tr>
                      <tr><td>重击·布景之形伤害</td><td>40.62%*2</td><td>43.96%*2</td><td>47.29%*2</td><td>51.95%*2</td><td>55.28%*2</td><td>59.11%*2</td><td>64.44%*2</td><td>69.77%*2</td><td>75.10%*2</td><td>80.76%*2</td></tr>
                      <tr><td>空中攻击·布景之形伤害</td><td>14.88%+22.32%</td><td>16.11%+24.16%</td><td>17.33%+25.99%</td><td>19.03%+28.55%</td><td>20.25%+30.38%</td><td>21.66%+32.48%</td><td>23.61%+35.41%</td><td>25.56%+38.34%</td><td>27.51%+41.27%</td><td>29.59%+44.38%</td></tr>
                      <tr><td>闪避反击·布景之形伤害</td><td>24.82%*3</td><td>26.86%*3</td><td>28.90%*3</td><td>31.74%*3</td><td>33.78%*3</td><td>36.12%*3</td><td>39.38%*3</td><td>42.63%*3</td><td>45.89%*3</td><td>49.35%*3</td></tr>
                      <tr><td>普攻·幻灭之形第一段伤害</td><td>18.36%</td><td>19.87%</td><td>21.38%</td><td>23.48%</td><td>24.99%</td><td>26.72%</td><td>29.13%</td><td>31.54%</td><td>33.95%</td><td>36.51%</td></tr>
                      <tr><td>普攻·幻灭之形第二段伤害</td><td>18.87%+7.08%*4</td><td>20.42%+7.66%*4</td><td>21.96%+8.24%*4</td><td>24.13%+9.05%*4</td><td>25.68%+9.63%*4</td><td>27.45%+10.30%*4</td><td>29.93%+11.23%*4</td><td>32.40%+12.15%*4</td><td>34.88%+13.08%*4</td><td>37.51%+14.07%*4</td></tr>
                      <tr><td>普攻·幻灭之形第三段伤害</td><td>31.38%</td><td>33.96%</td><td>36.53%</td><td>40.13%</td><td>42.71%</td><td>45.67%</td><td>49.78%</td><td>53.90%</td><td>58.02%</td><td>62.39%</td></tr>
                      <tr><td>普攻·幻灭之形第四段伤害</td><td>17.88%+41.71%</td><td>19.34%+45.13%</td><td>20.81%+48.55%</td><td>22.86%+53.34%</td><td>24.33%+56.76%</td><td>26.01%+60.69%</td><td>28.36%+66.16%</td><td>30.70%+71.64%</td><td>33.05%+77.11%</td><td>35.54%+82.92%</td></tr>
                      <tr><td>重击·幻灭之形伤害</td><td>68.94%</td><td>74.60%</td><td>80.25%</td><td>88.17%</td><td>93.82%</td><td>100.32%</td><td>109.36%</td><td>118.41%</td><td>127.45%</td><td>137.06%</td></tr>
                      <tr><td>空中攻击·幻灭之形第一段伤害</td><td>18.36%</td><td>19.87%</td><td>21.38%</td><td>23.48%</td><td>24.99%</td><td>26.72%</td><td>29.13%</td><td>31.54%</td><td>33.95%</td><td>36.51%</td></tr>
                      <tr><td>空中攻击·幻灭之形第二段伤害</td><td>18.87%+7.08%*4</td><td>20.42%+7.66%*4</td><td>21.96%+8.24%*4</td><td>24.13%+9.05%*4</td><td>25.68%+9.63%*4</td><td>27.45%+10.30%*4</td><td>29.93%+11.23%*4</td><td>32.40%+12.15%*4</td><td>34.88%+13.08%*4</td><td>37.51%+14.07%*4</td></tr>
                      <tr><td>空中攻击·幻灭之形第三段伤害</td><td>31.38%</td><td>33.96%</td><td>36.53%</td><td>40.13%</td><td>42.71%</td><td>45.67%</td><td>49.78%</td><td>53.90%</td><td>58.02%</td><td>62.39%</td></tr>
                      <tr><td>空中攻击·幻灭之形第四段伤害</td><td>17.88%+41.71%</td><td>19.34%+45.13%</td><td>20.81%+48.55%</td><td>22.86%+53.34%</td><td>24.33%+56.76%</td><td>26.01%+60.69%</td><td>28.36%+66.16%</td><td>30.70%+71.64%</td><td>33.05%+77.11%</td><td>35.54%+82.92%</td></tr>
                      <tr><td>空中重击·幻灭之形伤害</td><td>14.88%+22.32%</td><td>16.11%+24.16%</td><td>17.33%+25.99%</td><td>19.03%+28.55%</td><td>20.25%+30.38%</td><td>21.66%+32.48%</td><td>23.61%+35.41%</td><td>25.56%+38.34%</td><td>27.51%+41.27%</td><td>29.59%+44.38%</td></tr>
                      <tr><td>闪避反击·幻灭之形伤害</td><td>54.36%</td><td>58.82%</td><td>63.28%</td><td>69.52%</td><td>73.98%</td><td>79.10%</td><td>86.24%</td><td>93.37%</td><td>100.50%</td><td>108.08%</td></tr>
                      <tr><td>重击·布景之形耐力消耗</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>空中攻击·布景之形耐力消耗</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td></tr>
                      <tr><td>重击·幻灭之形耐力消耗</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>空中攻击·幻灭之形耐力消耗（每段）</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td></tr>
                      <tr><td>空中重击·幻灭之形耐力消耗</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td><td>30</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣技能 -->
            <div class="skill-content" v-show="activeSkillTab === 1">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/8221cb4c41234f0baf70ad1ff16de7f820260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">泡沫蜜饵</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">拟态泡泡·布景之形</strong><br/>牵引周围的目标，造成<span class="text-red">热熔伤害</span>。</p>
                <p><strong class="text-gold">轻唤·幻灭之形</strong><br/>牵引周围的目标，造成<span class="text-red">热熔伤害</span>。<br/>该技能与<span class="text-gold">放逐·幻灭之形</span>共享冷却时间。<br/>可在空中施放。</p>
                <p><strong class="text-gold">放逐·幻灭之形</strong><br/>拥有<strong>【<span class="text-gold-underline">黯核</span>】</strong>时，<span class="text-gold">轻唤·幻灭之形</span>替换为<span class="text-gold">放逐·幻灭之形</span>。<br/>施放<strong><span class="text-gold">放逐·幻灭之形</span>第1段</strong>，牵引周围目标，造成<span class="text-red">热熔伤害</span>，施放后一定时间内短按<span class="text-gold">普攻</span>或<span class="text-gold">共鸣技能</span>，可施放<span class="text-gold">放逐·幻灭之形第2段</span>。<br/><span class="text-gold">放逐·幻灭之形第2段</span>将消耗所有<strong>【<span class="text-gold-underline">黯核</span>】</strong>，造成<span class="text-red">热熔伤害</span>，本次攻击每消耗1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>，伤害倍率提升150%。<br/>该技能伤害为共鸣解放伤害。<br/>该技能与<span class="text-gold">轻唤·幻灭之形</span>共享冷却时间。<br/>可在空中施放。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/b882ba18c1dd43d5843755e9ae5cda0f20250209.png" width="92" height="92" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升1.80%</p></td>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升4.20%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>拟态泡泡·布景之形伤害</td><td>8.76%*3+26.28%</td><td>9.48%*3+28.44%</td><td>10.20%*3+30.59%</td><td>11.21%*3+33.61%</td><td>11.93%*3+35.77%</td><td>12.75%*3+38.25%</td><td>13.90%*3+41.69%</td><td>15.05%*3+45.14%</td><td>16.20%*3+48.59%</td><td>17.42%*3+52.25%</td></tr>
                      <tr><td>轻唤·幻灭之形伤害</td><td>15.65%+7.30%*5</td><td>16.93%+7.90%*5</td><td>18.21%+8.50%*5</td><td>20.01%+9.34%*5</td><td>21.29%+9.94%*5</td><td>22.77%+10.63%*5</td><td>24.82%+11.58%*5</td><td>26.87%+12.54%*5</td><td>28.92%+13.50%*5</td><td>31.10%+14.52%*5</td></tr>
                      <tr><td>放逐·幻灭之形第一段伤害</td><td>17.44%*3</td><td>18.88%*3</td><td>20.31%*3</td><td>22.31%*3</td><td>23.74%*3</td><td>25.38%*3</td><td>27.67%*3</td><td>29.96%*3</td><td>32.25%*3</td><td>34.68%*3</td></tr>
                      <tr><td>放逐·幻灭之形第二段伤害</td><td>56.34%</td><td>60.96%</td><td>65.58%</td><td>72.05%</td><td>76.67%</td><td>81.99%</td><td>89.38%</td><td>96.77%</td><td>104.16%</td><td>112.01%</td></tr>
                      <tr><td>拟态泡泡·布景之形冷却时间</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>轻唤·幻灭之形冷却时间</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr>
                      <tr><td>放逐·幻灭之形冷却时间</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣回路 -->
            <div class="skill-content" v-show="activeSkillTab === 2">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/a8a0958072284f95b159c2beb551634e20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">"天衣无缝"</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">蚀域</strong><br/>施放共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>后，生成<span class="text-gold">蚀域</span>，持续30秒。自身生成的<span class="text-gold">蚀域</span>同时最多存在一个。<br/><span class="text-gold">蚀域</span>每4秒发动1次攻击，牵引周围的目标，对目标造成<span class="text-red">热熔伤害</span>。该技能伤害为<span class="text-gold">共鸣解放伤害</span>。</p>
                <p><strong class="text-gold">【虚质粒子】</strong><br/>处于<span class="text-gold">幻灭之形</span>且<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>大于0时，<span class="text-gold">常态攻击</span>命中目标，消耗<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>，使本次技能获得以下效果：<br/>·伤害为<span class="text-gold">共鸣解放伤害</span>，且伤害倍率提升50%。<br/>·<strong>【<span class="text-gold-underline">共形能量</span>】</strong>获取效率提升100%。</p>
                <p><strong class="text-gold">共鸣模态·聚爆</strong><br/>处于<span class="text-gold">共鸣模态·聚爆</span>时，获得以下效果：<br/>·以下技能造成伤害时，可为目标附加2次<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>，同一技能对同一目标2秒内只能触发1次。<br/>变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣解放<span class="text-gold">帷幕终景·布景之形</span>、共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>、<span class="text-gold">蚀域</span>。<br/>·以下技能造成伤害时，可为目标附加<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>，同一技能对同一目标2秒内只能触发1次。<br/><span class="text-gold">普攻·布景之形第3段</span>、<span class="text-gold">普攻·布景之形第4段</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>。<br/>·达妮娅处于编队时，敌人被<strong>【<span class="text-gold-underline">聚爆效应</span>】</strong>的伤害击败，本次击败将视为距离其最近的登场角色造成。</p>
                <p><strong class="text-gold">共鸣模态·集谐</strong><br/>处于<span class="text-gold">共鸣模态·集谐</span>时，获得以下效果：<br/>·以下技能造成伤害时，可为目标附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>，刷新目标<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>的持续时间，同一技能对同一目标2秒内只能触发1次。<br/>变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣解放<span class="text-gold">帷幕终景·布景之形</span>、共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>、<span class="text-gold">蚀域</span>、<span class="text-gold">普攻·布景之形第3段</span>、<span class="text-gold">普攻·布景之形第4段</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>。<br/>·队伍中的角色附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>时，目标将积累偏谐值上限50%的<strong>【<span class="text-gold-underline">偏谐值</span>】</strong>，该效果对同一目标300秒内只能触发1次。</p>
                <p><strong class="text-gold">【黯核】获取规则</strong><br/><strong>【<span class="text-gold-underline">黯核</span>】</strong>上限3枚。<br/>处于<span class="text-gold">熵变强化</span>时，每12秒获得1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>。<br/>施放变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>获得1枚<strong>【<span class="text-gold-underline">黯核</span>】</strong>。</p>
                <p><strong class="text-gold">【虚质粒子】获取规则</strong><br/><strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>上限100点。<br/>处于<span class="text-gold">布景之形</span>，<span class="text-gold">常态攻击</span>造成伤害时，获得<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。<br/>施放变奏技能<span class="text-gold">久疏问候！</span>、变奏技能<span class="text-gold">轻叩门扉</span>、共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>获得25点<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。</p>
                <p><strong class="text-gold">【共形能量】获取规则</strong><br/><strong>【<span class="text-gold-underline">共形能量</span>】</strong>上限100点。<br/>处于<span class="text-gold">幻灭之形</span>，<strong>常态攻击</strong>、共鸣技能<span class="text-gold">轻唤·幻灭之形</span>造成伤害时，获得<strong>【<span class="text-gold-underline">共形能量</span>】</strong>。<br/>施放共鸣技能<span class="text-gold">放逐·幻灭之形第2段</span>获得40点<strong>【<span class="text-gold-underline">共形能量</span>】</strong>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px">分支强化：固定技能</strong></p>
                <table class="info-table circuit-table">
                  <colgroup><col style="width:17%"/><col style="width:83%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="circuit-icon-cell">
                        <img src="https://prod-alicdn-community.kurobbs.com/forum/5c4bc2c4b1ad42d19c9ffdd22fea138220260520.png" width="92" height="92" alt="" /><br/>
                        <strong class="text-gold">伪物弥留</strong>
                      </td>
                      <td class="value-cell">处于<span class="text-gold">布景之形</span>进入战斗时，<strong>【<span class="text-gold-underline">黯核</span>】</strong>不足2枚则回复至2枚，<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>不足20点则回复至20点。该效果每12秒可触发1次。</td>
                    </tr>
                    <tr>
                      <td class="circuit-icon-cell">
                        <img src="https://prod-alicdn-community.kurobbs.com/forum/945ccf37f3a540a0a63d237283dcc45c20260520.png" width="92" height="92" alt="" /><br/>
                        <strong class="text-gold">蚀刻繁彩</strong>
                      </td>
                      <td class="value-cell">处于<span class="text-gold">熵变强化</span>时，根据<span class="text-gold">共鸣模态</span>获得以下效果：<br/>·若处于<span class="text-gold">共鸣模态·聚爆</span>，队伍中的角色<span class="text-red">热熔伤害加成提升</span>30%。<br/>·若处于<span class="text-gold">共鸣模态·集谐</span>，队伍中的角色<strong>谐度破坏增幅提升</strong>10点。队伍中的角色偏谐值累积效率超过100%时，每超过10%的偏谐值累积效率使对应角色谐度破坏增幅提升8点，上限40点。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>蚀域每次伤害</td><td>68.58%</td><td>74.20%</td><td>79.82%</td><td>87.69%</td><td>93.32%</td><td>99.78%</td><td>108.78%</td><td>117.78%</td><td>126.77%</td><td>136.33%</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 共鸣解放 -->
            <div class="skill-content" v-show="activeSkillTab === 3">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/e0ae116cd20a4872b3d0ee33209f8bc020260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">帷幕终景</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">帷幕终景·布景之形</strong><br/>造成<span class="text-red">热熔伤害</span>。<br/>施放该技能时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续12秒。随后切换至<span class="text-gold">幻灭之形</span>。</p>
                <p><strong class="text-gold">帷幕终景·幻灭之形</strong><br/><strong>【<span class="text-gold-underline">共形能量</span>】</strong>满时，可消耗所有<strong>【<span class="text-gold-underline">共形能量</span>】</strong>与<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>施放该技能。<br/>造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后，获得<span class="text-gold">熵变强化·布景之形</span>，持续30秒。随后切换至<span class="text-gold">布景之形</span>。<br/>可在空中施放。</p>
                <p><strong class="text-gold">熵变强化·幻灭之形</strong><br/><strong>攻击提升</strong>30%。<br/>获得该效果时，移除<span class="text-gold">熵变强化·布景之形</span>。</p>
                <p><strong class="text-gold">熵变强化·布景之形</strong><br/>每秒获得1点<strong>【<span class="text-gold-underline">虚质粒子</span>】</strong>。<br/>获得该效果时，移除<span class="text-gold">熵变强化·幻灭之形</span>。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/b882ba18c1dd43d5843755e9ae5cda0f20250209.png" width="92" height="92" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升1.80%</p></td>
                      <td><p><strong class="text-gold">属性加成: 攻击提升</strong></p><p>攻击提升4.20%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>帷幕终景·布景之形伤害</td><td>200.00%</td><td>216.40%</td><td>232.80%</td><td>255.76%</td><td>272.16%</td><td>291.02%</td><td>317.26%</td><td>343.50%</td><td>369.74%</td><td>397.62%</td></tr>
                      <tr><td>帷幕终景·幻灭之形伤害</td><td>100.00%*4</td><td>108.20%*4</td><td>116.40%*4</td><td>127.88%*4</td><td>136.08%*4</td><td>145.51%*4</td><td>158.63%*4</td><td>171.75%*4</td><td>184.87%*4</td><td>198.81%*4</td></tr>
                      <tr><td>帷幕终景·布景之形冷却时间</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td></tr>
                      <tr><td>帷幕终景·幻灭之形冷却时间</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td><td>25</td></tr>
                      <tr><td>帷幕终景·布景之形消耗共鸣能量</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td><td>125</td></tr>
                      <tr><td>帷幕终景·布景之形回复协奏能量</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                      <tr><td>帷幕终景·幻灭之形回复协奏能量</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 变奏技能 -->
            <div class="skill-content" v-show="activeSkillTab === 4">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/66bfa442b5144fa1b0f92687211506cb20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">谨此致访</h3>
              </div>
              <div class="skill-details">
                <p><strong class="text-gold">久疏问候！</strong><br/>处于<span class="text-gold">布景之形</span>时可施放该技能，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能后在一定时间内短按<span class="text-gold">普攻</span>，将会施放<span class="text-gold">普攻·布景之形第4段</span>。</p>
                <p><strong class="text-gold">轻叩门扉</strong><br/>处于<span class="text-gold">幻灭之形</span>时可施放该技能，造成<span class="text-red">热熔伤害</span>。<br/>施放该技能时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续12秒。</p>
              </div>
              <hr class="skill-divider" />
              <div class="skill-branch">
                <p><strong class="text-gold" style="font-size:16px"><img src="https://prod-alicdn-community.kurobbs.com/forum/692daaf9ac574b14a8fd8b998bc331d820250209.png" width="91" alt="" />分支强化：属性加成</strong></p>
                <table class="info-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升2.40%</p></td>
                      <td><p><strong class="text-gold">属性加成:暴击伤害提升</strong></p><p>暴击伤害提升5.60%</p></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details class="skill-data-details" open>
                <summary class="skill-data-summary"><strong>技能数据</strong></summary>
                <div class="skill-data-table">
                  <table class="info-table data-table">
                    <thead>
                      <tr><th>等级</th><th>Lv 1</th><th>Lv 2</th><th>Lv 3</th><th>Lv 4</th><th>Lv 5</th><th>Lv 6</th><th>Lv 7</th><th>Lv 8</th><th>Lv 9</th><th>Lv 10</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>久疏问候！伤害</td><td>52.62%</td><td>56.94%</td><td>61.25%</td><td>67.30%</td><td>71.61%</td><td>76.57%</td><td>83.48%</td><td>90.38%</td><td>97.28%</td><td>104.62%</td></tr>
                      <tr><td>轻叩门扉伤害</td><td>26.02%*3</td><td>28.16%*3</td><td>30.29%*3</td><td>33.28%*3</td><td>35.41%*3</td><td>37.87%*3</td><td>41.28%*3</td><td>44.69%*3</td><td>48.11%*3</td><td>51.74%*3</td></tr>
                      <tr><td>久疏问候！回复协奏能量</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
                      <tr><td>轻叩门扉回复协奏能量</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <!-- 延奏技能 -->
            <div class="skill-content" v-show="activeSkillTab === 5">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/0d1d9fe449f8431e95f7ebf096a2379d20260520.png" width="92" height="92" alt="" />
                <h3 class="skill-name">未竟的谎言</h3>
              </div>
              <div class="skill-details">
                <p>处于<span class="text-gold">共鸣模态·聚爆</span>时，队伍中登场角色周围的<strong>目标受到聚爆效应伤害加深</strong>60%，持续30秒。<br/>达妮娅切换模态时，该效果提前结束。</p>
                <p>处于<span class="text-gold">共鸣模态·集谐</span>时，下一个登场的<strong>角色全伤害加深</strong>15%，持续16秒。<br/>效果持续期间，该角色附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>后，该<strong>全伤害加深效果提升</strong>至40%。<br/>切换至其他角色或达妮娅切换模态时，该效果提前结束。</p>
              </div>
            </div>

            <!-- 谐度破坏 -->
            <div class="skill-content" v-show="activeSkillTab === 6">
              <div class="skill-header">
                <img src="https://prod-alicdn-community.kurobbs.com/forum/d4de0316f1e74bd5b785c134d34c592620251224.png" width="92" height="92" alt="" />
                <h3 class="skill-name">计时的溃灭</h3>
              </div>
              <div class="skill-details">
                <p>目标<strong>【<span class="text-gold-underline">偏谐值</span>】</strong>满时，达妮娅可对其施放<strong>【<span class="text-gold-underline">谐度破坏</span>】</strong>。</p>
                <p>处于<span class="text-gold">共鸣模态·集谐</span>时，获得以下效果：<br/>·达妮娅拥有为目标附加<strong>【<span class="text-gold-underline">集谐·偏移</span>】</strong>的能力。<br/>·达妮娅拥有响应<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>的能力。<br/>响应<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>：目标每有一层<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>效果，达妮娅自身的每点谐度破坏增幅会使自身对该目标造成的最终伤害提升0.12%。达妮娅在编队中时，目标的<strong>【<span class="text-gold-underline">集谐·干涉</span>】</strong>效果的层数上限增加1层。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 共鸣链 -->
        <div id="resonance-chain" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('resonanceChain')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">共鸣链</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.resonanceChain">
            <table class="info-table resonance-table">
              <colgroup><col style="width:25%"/><col style="width:75%"/></colgroup>
              <tbody>
                <tr>
                  <td class="label-cell">名称</td>
                  <td class="label-cell">效果</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/27a4bed1b8f443c99a77e5cfef8cbb8320260520.png" width="42" height="42" alt="" /><br/>
                    <strong>薄明梦中的寂静光辉</strong>
                  </td>
                  <td class="value-cell">
                    暴击伤害提升<strong>30</strong>%。<br/>
                    施放共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>、<span class="text-gold">共鸣技能放逐·幻灭之形</span>、<span class="text-gold">普攻·幻灭之形第3段</span>、<span class="text-gold">普攻·幻灭之形第4段</span>、<span class="text-gold">空中攻击·幻灭之形第3段</span>、<span class="text-gold">空中攻击·幻灭之形第4段</span>期间，免疫打断。<br/>
                    处于<span class="text-gold">布景之形</span>进入战斗时，获得<span class="text-gold">熵变强化·布景之形</span>，持续<strong>30</strong>秒。<br/>
                    处于<span class="text-gold">幻灭之形</span>进入战斗时，获得<span class="text-gold">熵变强化·幻灭之形</span>，持续<strong>12</strong>秒。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/9f0cfb10f6464f38a72c63c4c0f2e8e020260520.png" width="42" height="42" alt="" /><br/>
                    <strong>坠入此世一片潮水</strong>
                  </td>
                  <td class="value-cell">
                    处于<span class="text-gold">共鸣模态·聚爆</span>，队伍中的角色施加<span class="text-red">【聚爆效应】</span>后，该角色热熔伤害加成提升<strong>50</strong>%，持续<strong>15</strong>秒。登场角色附近的敌人触发<span class="text-red">【聚爆效应】</span>引爆后，达妮娅获得<strong>1</strong>层<span class="text-gold">简并虚质</span>，持续<strong>15</strong>秒，上限<strong>10</strong>层。每层<span class="text-gold">简并虚质</span>使达妮娅造成伤害无视目标<strong>1</strong>%热熔伤害抗性。<br/>
                    达妮娅切换模态时，该效果提前结束。<br/>
                    处于<span class="text-gold">共鸣模态·集谐</span>，<span class="text-gold">共鸣回路</span>效果提升：队伍中的角色施加<span class="text-gold">【集谐·偏移】</span>后，该角色谐度破坏增幅提升<strong>20</strong>点，持续<strong>15</strong>秒，目标将积累偏谐值上限<strong>100</strong>%的<span class="text-gold">【偏谐值】</span>，积累<span class="text-gold">【偏谐值】</span>效果对同一目标<strong>300</strong>秒内只能触发<strong>1</strong>次。<br/>
                    达妮娅切换模态时，该效果提前结束。<br/>
                    共鸣技能<span class="text-gold">放逐·幻灭之形</span>伤害倍率提升<strong>40</strong>%。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/2a7c62a450f94f5aaa8ec7ef24a3481c20260520.png" width="42" height="42" alt="" /><br/>
                    <strong>黑夜与风中奔驰着赤杨</strong>
                  </td>
                  <td class="value-cell">
                    共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>伤害倍率提升<strong>80</strong>%。<br/>
                    <span class="text-gold">【黯核】</span>上限提升至5枚，处于<span class="text-gold">熵变强化</span>时，<span class="text-gold">【黯核】</span>的获取间隔缩短至<strong>6</strong>秒。<br/>
                    <span class="text-gold">熵变强化·布景之形</span>效果获得强化：每秒获得<span class="text-gold">【虚质粒子】</span>提升至<strong>4</strong>点。<br/>
                    <span class="text-gold">熵变强化·幻灭之形</span>效果获得强化：施放共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>时，额外回复<strong>30</strong>点协奏能量。<br/>
                    固有技能<span class="text-gold">伪物弥留</span>效果强化：进入战斗时，<span class="text-gold">【黯核】</span>与<span class="text-gold">【虚质粒子】</span>回复至上限。该效果每<strong>12</strong>秒可触发<strong>1</strong>次。<br/>
                    <span class="text-gold">【黯核】</span>数量达到上限时，施放<strong>普攻·布景之形第4段</strong>、共鸣技能<span class="text-gold">拟态泡泡·布景之形</span>消耗所有<span class="text-gold">【黯核】</span>，使本次技能伤害倍率增加<strong>1200</strong>%，本次伤害为<span class="text-gold">共鸣解放伤害</span>。
                  </td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/0995ef1878aa42209db44eb6bd9f00c420260520.png" width="42" height="42" alt="" /><br/>
                    <strong>从远方，回到远方</strong>
                  </td>
                  <td class="value-cell"><span class="text-gold">蚀域</span>攻击间隔缩短至<strong>3</strong>秒。</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/e12ad39723cc414c8d8eb8c09584461d20260520.png" width="42" height="42" alt="" /><br/>
                    <strong>若能以谎言缝补心脏</strong>
                  </td>
                  <td class="value-cell">共鸣解放<span class="text-gold">帷幕终景·布景之形</span>造成的伤害提升<strong>100</strong>%。</td>
                </tr>
                <tr>
                  <td class="resonance-name-cell">
                    <img src="https://prod-alicdn-community.kurobbs.com/forum/f34fb6872c6147f48dfc7f2542b8655420260520.png" width="42" height="42" alt="" /><br/>
                    <strong>祝愿你于静默中，得到太阳</strong>
                  </td>
                  <td class="value-cell">
                    处于<span class="text-gold">熵变强化</span>时，攻击提升<strong>60</strong>%，热熔伤害加成提升<strong>60</strong>%。<br/>
                    处于<span class="text-gold">共鸣模态·聚爆</span>时，<span class="text-gold">蚀域</span>对目标造成伤害后，根据<span class="text-red">【聚爆效应】</span>层数上限引爆<span class="text-red">【聚爆效应】</span>，本次引爆对<span class="text-red">【聚爆效应】</span>主目标的伤害倍率提升<strong>200</strong>%，且不移除<strong><span class="text-red">【聚爆效应】</span></strong>层数。同一目标最多可受到<strong>1</strong>次该效果，目标受到共鸣解放<span class="text-gold">帷幕终景·幻灭之形</span>的伤害后，重置该次数，重置效果对同一目标<strong>2</strong>秒内只能触发<strong>1</strong>次。<br/>
                    处于<span class="text-gold">共鸣模态·集谐</span>时，队伍中的角色对拥有<span class="text-gold">【集谐·偏移】</span>的<span class="text-gold">【失谐】</span>目标造成<span class="text-gold">谐度破坏伤害</span>时，将额外附加<strong>1</strong>层<span class="text-gold"><strong>【集谐·干涉】</strong></span>，该效果对同一目标3秒内只能触发<strong>1</strong>次。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 角色突破材料 -->
        <div id="breakthrough-materials" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('breakthrough')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
            <div class="component-header-content">
              <span class="component-title-text">角色突破材料</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.breakthrough">
            <div class="stat-tabs">
              <button v-for="(tab, i) in breakthroughTabs" :key="i" class="stat-tab" :class="{ active: activeBreakthroughTab === i }" @click="activeBreakthroughTab = i">{{ tab }}</button>
            </div>

            <!-- 一阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 0">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">20</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">40</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x5000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 二阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 1">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">40</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">50</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x4</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x3</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x10000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 三阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 2">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">50</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">60</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x8</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x8</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x6</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x15000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 四阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 3">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">60</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">70</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x12</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x9</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x20000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 五阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 4">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">70</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">80</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x8</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x16</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x12</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x40000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 六阶突破 -->
            <div class="breakthrough-content" v-show="activeBreakthroughTab === 5">
              <table class="info-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr><td class="label-cell">所需等级</td><td class="value-cell">80</td></tr>
                  <tr><td class="label-cell">等级上限</td><td class="value-cell">90</td></tr>
                  <tr><td class="label-cell" colspan="2">突破素材</td></tr>
                </tbody>
              </table>
              <table class="info-table material-table">
                <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                <tbody>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/da19f7ccbfa941d19f0aa777feb85b1520260429.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1499167890179710976" target="_blank">星之梦</a>x20</td>
                  </tr>
                  <tr>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/369e3015807741cf95d22306c08d957820251222.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1449136139499237376" target="_blank">不熄的裁决</a>x16</td>
                    <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x80000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 技能突破材料 -->
        <div id="skill-materials" class="info-component">
          <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('skillMaterial')">
            <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '100px 0' }"></div>
            <div class="component-header-content">
              <span class="component-title-text">技能突破材料</span>
              <button class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="component-body" v-show="!collapseState.skillMaterial">
            <div class="stat-tabs">
              <button v-for="(tab, i) in skillMaterialTabs" :key="i" class="stat-tab" :class="{ active: activeSkillMaterialTab === i }" @click="activeSkillMaterialTab = i">{{ tab }}</button>
            </div>

            <!-- 常态攻击 -->
            <div class="skill-material-content" v-show="activeSkillMaterialTab === 0">
              <div class="branch-section">
                <p><strong class="text-bronze">分支强化材料消耗</strong></p>
                <hr class="skill-divider" />
                <p><strong>暴击伤害提升2.40%</strong></p>
                <p>三阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3</td>
                      <td class="material-cell"></td>
                    </tr>
                  </tbody>
                </table>
                <hr class="skill-divider" />
                <p><strong>暴击伤害提升5.60%</strong></p>
                <p>五阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table class="info-table data-table" style="width:100%">
                <thead>
                  <tr><th colspan="9">等级</th></tr>
                  <tr><th>LV.2</th><th>LV.3</th><th>LV.4</th><th>LV.5</th><th>LV.6</th><th>LV.7</th><th>LV.8</th><th>LV.9</th><th>LV.10</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x1500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x2000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x4500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x6000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x16000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x5<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x30000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x70000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x6<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 共鸣技能 -->
            <div class="skill-material-content" v-show="activeSkillMaterialTab === 1">
              <div class="branch-section">
                <p><strong class="text-bronze">分支强化材料消耗</strong></p>
                <hr class="skill-divider" />
                <p><strong>攻击提升1.80%</strong></p>
                <p>二阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3</td>
                      <td class="material-cell"></td>
                    </tr>
                  </tbody>
                </table>
                <hr class="skill-divider" />
                <p><strong>攻击提升4.20%</strong></p>
                <p>四阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table class="info-table data-table" style="width:100%">
                <thead>
                  <tr><th colspan="9">等级</th></tr>
                  <tr><th>LV.2</th><th>LV.3</th><th>LV.4</th><th>LV.5</th><th>LV.6</th><th>LV.7</th><th>LV.8</th><th>LV.9</th><th>LV.10</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x1500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x2000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x4500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x6000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x16000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x5<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x30000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x70000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x6<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 共鸣回路 -->
            <div class="skill-material-content" v-show="activeSkillMaterialTab === 2">
              <div class="branch-section">
                <p><strong class="text-bronze">分支强化材料消耗</strong></p>
                <hr class="skill-divider" />
                <p><strong>固有技能：伪物弥留</strong></p>
                <p>二阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x10000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
                <hr class="skill-divider" />
                <p><strong>固有技能：蚀刻繁彩</strong></p>
                <p>四阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x20000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table class="info-table data-table" style="width:100%">
                <thead>
                  <tr><th colspan="9">等级</th></tr>
                  <tr><th>LV.2</th><th>LV.3</th><th>LV.4</th><th>LV.5</th><th>LV.6</th><th>LV.7</th><th>LV.8</th><th>LV.9</th><th>LV.10</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x1500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x2000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x4500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x6000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x16000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x5<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x30000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x70000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x6<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 共鸣解放 -->
            <div class="skill-material-content" v-show="activeSkillMaterialTab === 3">
              <div class="branch-section">
                <p><strong class="text-bronze">分支强化材料消耗</strong></p>
                <hr class="skill-divider" />
                <p><strong>攻击提升1.80%</strong></p>
                <p>三阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3</td>
                      <td class="material-cell"></td>
                    </tr>
                  </tbody>
                </table>
                <hr class="skill-divider" />
                <p><strong>攻击提升4.20%</strong></p>
                <p>五阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table class="info-table data-table" style="width:100%">
                <thead>
                  <tr><th colspan="9">等级</th></tr>
                  <tr><th>LV.2</th><th>LV.3</th><th>LV.4</th><th>LV.5</th><th>LV.6</th><th>LV.7</th><th>LV.8</th><th>LV.9</th><th>LV.10</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x1500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x2000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x4500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x6000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x16000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x5<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x30000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x70000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x6<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 变奏技能 -->
            <div class="skill-material-content" v-show="activeSkillMaterialTab === 4">
              <div class="branch-section">
                <p><strong class="text-bronze">分支强化材料消耗</strong></p>
                <hr class="skill-divider" />
                <p><strong>暴击伤害提升2.40%</strong></p>
                <p>三阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3</td>
                      <td class="material-cell"></td>
                    </tr>
                  </tbody>
                </table>
                <hr class="skill-divider" />
                <p><strong>暴击伤害提升5.60%</strong></p>
                <p>五阶突破</p>
                <table class="info-table material-table">
                  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
                  <tbody>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                    </tr>
                    <tr>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3</td>
                      <td class="material-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table class="info-table data-table" style="width:100%">
                <thead>
                  <tr><th colspan="9">等级</th></tr>
                  <tr><th>LV.2</th><th>LV.3</th><th>LV.4</th><th>LV.5</th><th>LV.6</th><th>LV.7</th><th>LV.8</th><th>LV.9</th><th>LV.10</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x1500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/7e8de832062d4ae49af023383823988420251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446635372963983360" target="_blank">低频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/240b390663b847cfaedbfb098e1f1ef620251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446634490008608768" target="_blank">拼凑的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x2000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x4500</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/f35264e711614e09919332b06a8058a120251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633814536921088" target="_blank">中频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/cba83583c4fa43498aa086de31a6452b20251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446633033238749184" target="_blank">断续的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x6000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x16000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/421a962ae70d40eea380a1c5353786ee20251223.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636856481062912" target="_blank">高频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/bc4a781863f94e32b03b171dacdb2c9720251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446636379580309504" target="_blank">凝固的弦线</a>x5<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x30000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x2<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x50000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x3<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x70000</td>
                    <td><img src="https://prod-alicdn-community.kurobbs.com/forum/a93ae52da475488e9a4e5e8427f6cc9520251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446638304712638464" target="_blank">全频锐棱声核</a>x4<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/81cb97c4ce7442919dbc51c1c2ffe0f320251218.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1446637577485971456" target="_blank">如歌的弦线</a>x6<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/abbbb6965cf9467ca57e00cad718092f20260428.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498782731192119296" target="_blank">质问的我们</a>x1<br/><img src="https://prod-alicdn-community.kurobbs.com/forum/c937896ee77e484dbe1a397956d4f13320240518.png" width="64" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1241548696255807488" target="_blank">贝币</a>x100000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    <!-- 模块：角色档案 -->
    <div id="character-archive" class="module glass-panel">
      <h2 class="module-title">角色档案</h2>

      <!-- 共鸣能力鉴定报告 -->
      <div id="ability-report" class="info-component">
        <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('abilityReport')">
          <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
          <div class="component-header-content">
            <span class="component-title-text">共鸣能力鉴定报告</span>
            <button class="collapse-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="component-body" v-show="!collapseState.abilityReport">
          <div class="component-content-text">
            <p><strong class="text-bronze" style="font-size:18px">共鸣能力：</strong>泡影视阈</p>
            <p><strong class="text-bronze" style="font-size:18px">频谱检验报告</strong></p>
            <hr class="skill-divider" />
            <p>「调自深空联合：星炬学院学生档案」</p>
            <p>「共鸣能力检验报告 RA2499-G」</p>
            <p>学生姓名：达妮娅</p>
            <p>是否具有适格者资质：否</p>
            <p>共鸣能力概述：受试样本拉贝尔曲线波动规律、具有显著周期性特征，检测结果判断为先天型共鸣者，声痕胸口。</p>
            <p>根据举荐方提供的档案，对象能够释放含有回音能量的泡泡，从而提供防护或战斗支援。必要情况下，也可以通过一次性释放泡泡中的回音能量进行爆破。</p>
            <p>此外，根据检测，这种泡泡有着独特的流体结构，除基本防护外，也能够起到类似隧者涂层的虚质隔绝作用。</p>
            <p class="text-italic">"她那用来释放泡泡的装置不是从呜呜物流的广告里买的吗？我侄女也买过同款！那种泡泡怎么可能抵挡虚质？"</p>
            <p class="text-italic">"当初到底是怎么归档的！我的天……这份档案里有半句话是真的吗？"</p>
            <p><strong class="text-bronze" style="font-size:18px">超频诊断报告</strong></p>
            <hr class="skill-divider" />
            <p>受试样本拉贝尔波形波形检测图呈椭圆形波动，时域表示稳定，未见任何异常波动倾向。检测结果判断为正常阶段。</p>
            <p>诊断结果：超频临界值正常，稳定性高，暂无超频风险。</p>
            <p>无过往超频史，拉贝尔曲线稳定。</p>
            <p>暂无需心理辅导。</p>
            <p class="text-italic">"无过往超频风险和过往超频史？你见过把虚质揉成方块拿来砸人的共鸣者吗？绯雪的战斗记录里她可是连声痕都裂开了！"</p>
            <p class="text-italic">"行了……你这档案我是一个字也不会信了，阿里曼，把黯原那边找到的记录发给我！"</p>
          </div>
        </div>
      </div>

      <!-- 珍贵之物 -->
      <div id="precious-items" class="info-component">
        <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('preciousItems')">
          <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)`, backgroundPosition: '101px 0' }"></div>
          <div class="component-header-content">
            <span class="component-title-text">珍贵之物</span>
            <button class="collapse-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="component-body" v-show="!collapseState.preciousItems">
          <div class="stat-tabs">
            <button v-for="(tab, i) in preciousItemTabs" :key="i" class="stat-tab" :class="{ active: activePreciousTab === i }" @click="activePreciousTab = i">{{ tab }}</button>
          </div>
          <div class="component-content-text" v-show="activePreciousTab === 0">
            <p><strong style="font-size:24px">「骗术师」<img src="https://prod-alicdn-community.kurobbs.com/forum/496a03d9f025493f8128ea52387831f820260520.png" width="92" alt="" /></strong></p>
            <hr class="skill-divider" />
            <p>达妮娅随身携带的玩偶。与平时见到的光鲜样子不同，破旧的身躯上挤满了手工缝补的痕迹，用于填充内部的虚质早已消失不见。</p>
            <p class="text-italic">"一个破碎又固执的容器，曾被世界所感知，所塑造——如今它正不断央求着：请您带给我一颗心，随便什么样的心都好。"</p>
          </div>
          <div class="component-content-text" v-show="activePreciousTab === 1">
            <p><strong style="font-size:24px">星炬纪念相册<img src="https://prod-alicdn-community.kurobbs.com/forum/872cb5ecdceb47a5a0ccbc3afaea26a720260520.png" width="92" alt="" /></strong></p>
            <hr class="skill-divider" />
            <p>被精心保管的相册，贴满了各种装饰，看得出相册的主人很珍视它。</p>
            <p>星炬学院的摄影同好会为每位成员都准备了一份个人影集，用于记录学生们在校园活动中的回忆。可这本相册里的内容大都是些集体合影，达妮娅总是露出微笑，一言不发地站在角落里……她通过这种方式来赚取学分。</p>
            <p class="text-italic">"荒野总是沉默不语——也许它本就什么都看不到、听不到，也不在乎我们说些什么，它只是延伸、延伸，向着无穷的远方延伸。"</p>
          </div>
          <div class="component-content-text" v-show="activePreciousTab === 2">
            <p><strong style="font-size:24px">「造梦者」<img src="https://prod-alicdn-community.kurobbs.com/forum/42de916b64d34697b80bb2f4f5d37ea020260520.png" width="92" alt="" /></strong></p>
            <hr class="skill-divider" />
            <p>用于制造巨大泡泡的装置，除造型比较梦幻外，并没有什么特别之处。</p>
            <p>比起武器，更像是玩具。</p>
            <p>达妮娅将虚质藏在泡泡之中，伪装出可以守护他人的美好假象。</p>
            <p class="text-italic">"其实阿列夫一从不曾对我们抱有敌意，祂只是对一切都漠不关心，在祂的尺度上，生命与希望都微不足道、毫无意义。可祂也因此永远无法理解，为何虚质空间的黑暗会充满色彩——因为那是来自一整片宇宙残骸的，早在万亿年前就死去的光。那是群星们存在过的证明。"</p>
          </div>
          <div class="component-content-text" v-show="activePreciousTab === 3">
            <p><strong style="font-size:24px"><a href="https://wiki.kurobbs.com/mc/item/1498831545168896000" target="_blank">夺目甜蜜</a><img src="https://prod-alicdn-community.kurobbs.com/forum/aa80f6ebf013462390b5a04a5d9f824c20260520.png" width="92" alt="" /></strong></p>
            <hr class="skill-divider" />
            <p class="text-muted">提高队伍中所有共鸣者28%治疗效果加成，持续时间30分钟，在多人游戏中仅对自己的角色生效。</p>
            <p>达妮娅在料理课上完成的创作，由于课上一直忙于试吃，最后只得选择果酱这种工序简易的料理。</p>
            <p>这一款果酱的糖分超标，腌制时间不足，熬制火候过大，导致成品最终未能充分混合口感与甜味。不过由于造型独特且有创意，适合拍照打卡留念，最后经同学们投票侥幸获得了不错的分数。<br/>"吃起来是甜甜的，看起来卖相也不错，这样就差不多了吧？嗯？口感和风味？抱歉，我不太明白你在说什么。"</p>
          </div>
        </div>
      </div>

      <!-- 角色故事 -->
      <div id="character-story" class="info-component">
        <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('characterStory')">
          <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
          <div class="component-header-content">
            <span class="component-title-text">角色故事</span>
            <button class="collapse-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="component-body" v-show="!collapseState.characterStory">
          <div class="stat-tabs">
            <button v-for="(tab, i) in storyTabs" :key="i" class="stat-tab" :class="{ active: activeStoryTab === i }" @click="activeStoryTab = i">{{ tab }}</button>
          </div>
          <div class="component-content-text story-content" v-show="activeStoryTab === 0">
            <p><strong class="text-bronze" style="font-size:18px">礼物</strong></p>
            <hr class="skill-divider" />
            <p>对于将她抚养长大的人们而言，"达妮娅"只是残星会资产的一部分。她的生命，是会长手中的一枚筹码。</p>
            <p>&nbsp;</p>
            <p>可"达妮娅"，严格来说却并不能算是一个名字。</p>
            <p>在女孩出生的地区，人们常在道别时说达斯维达尼亚，意味着"直到下次再见"。</p>
            <p>于人而言，名字是除生命外父母赠与子嗣的第一项恩赐，此后子嗣将以一个崭新个体的身份面对世界，形貌日渐完整，名字也愈发具有指代意味。</p>
            <p>女孩将达妮娅选为自己的名字，是因为对她而言，这是家人能留给她的唯一礼物。</p>
            <p>哪怕那只是一片属于无根浮萍的、奢侈的梦。</p>
            <p>她查询过自己的诞生记录，也曾质疑过自己并非被人工制造的存在，但最后能找到的，依然只有记忆里那幅模糊的道别景象。</p>
            <p>她无法通过这份记忆判断什么，每当她和会长提起这件事时，会长都告诉她：记忆并不可靠，忘了吧，一无所知对你才是最好的结果。</p>
            <p>也许会长说的不无道理。</p>
            <p>在她和娜斯塔霞聊起朋友们的名字时，她得知了那些藏在称呼背后的祈愿与故事：无论是祝福平安喜乐的，寄予理想抱负的，归根结底，大抵都是通向幸福的。可唯独问起"达妮娅"是什么含义时，她没能得到正面回应。</p>
            <p>娜斯塔霞不想说，她也就不再追问了。在对人类进行观察与模仿的一年里，她早已深谙藏匿与谎言的原理。</p>
            <p>也许，这世上真的有些无迹可寻的事物。</p>
            <p>达妮娅甚至无法判断这记忆究竟属于自己，还是来自制造自己的某个原体……甚至，只是被残星会植入的，用于令她屈从的伪证。</p>
            <p>女孩听残星会的研究人员提过，构成人体的细胞和物质其实每过一些年就会更换一遍，但生命的独特之处却在于，无论过去多久，都会留下些被不断修饰的东西。</p>
            <p>特别是那些再也找不回来路的人……只要是留在记忆里的，哪怕是一种嗅觉都想铭刻成意义，所以有人喜欢看暴雨，有人钟情一段并不特别的旋律，因为人总是擅长用非理性的行为表达情绪，然后故作姿态地展露理性的自己。</p>
            <p>或许，世界上真的曾经有一个与母亲挥手告别的，名为"达妮娅"的女孩。</p>
            <p>但，那真的是她吗？</p>
          </div>
          <div class="component-content-text story-content" v-show="activeStoryTab === 1">
            <p><strong class="text-bronze" style="font-size:18px">荒芜</strong></p>
            <hr class="skill-divider" />
            <p>依偎着坚实、冰冷的虚质舱壁，气泡和带有腥味的液体一起涌入达妮娅的口鼻。</p>
            <p>滴答，滴答，滴答。</p>
            <p>感官逐渐变得迟钝，时间被缓缓拉得绵长。</p>
            <p>她感受到那些构成自己的事物正在被分隔开：她的频率破裂成千丝万缕的线，身躯溶解为污浊汇入海洋——随后，她升腾为穿越世界的大雾与风，从东吹到西，从北刮到南，拂过没有色彩的荒原，直到抵达那片再熟悉不过的、腐烂的星空。</p>
            <p>而死寂的世界一如既往地凝视着她，一言不发。</p>
            <p>&nbsp;</p>
            <p>当会长选择达妮娅作为接受阿列夫一力量的"容器"时，除身体素质和频率适应性外，最重要的一点是：相比其他那些拥有丰富人生和情感的共鸣者，她做到了一无所有。而一无所有的人，对于自己和世界最大的感受往往就是"无意义"，这点与阿列夫一的存在逻辑相符。</p>
            <p>于是，就如同预期的那样，达妮娅成功地接受了这份力量的馈赠，她在虚质空间中与阿列夫一短暂地对视，那些虚质自此开始流经她的血管与脏器，赋予了她操纵虚质粒子，以及链接虚质空间的能力。</p>
            <p>那时，虚无曾一度让她感到寂静、熟悉和因此而生的心安。</p>
            <p>可后来，随着计划一点点推进，残星会却观测到达妮娅和虚无鸣式之间的共鸣强度正在迅速走低。</p>
            <p>力量本身并无变化，出现问题的，是原本被认定是空洞而纯粹的容器：毫无疑问，达妮娅并没有做到真正意义上的完美。</p>
            <p>在模仿人类行为和情绪的过程中，她获得了一颗脆弱而痛苦的心。</p>
            <p>弱者的心。</p>
            <p>这样的她，注定无法成为阿列夫一在此世的化身。因此，残星会需要一个强大到足以驾驭这份"虚无"的内容物来填充躯体，以此来完成制造阿列夫一共鸣者的最终一步。</p>
            <p>而达妮娅，也早就知道了自己的最终结局。</p>
            <p>只是，当那一天来临的时候，又该怎样评判自己迄今为止的生命呢？</p>
            <p>一个被驾驭操纵的傀儡，一个扭曲可怖的怪物……或者，就只是一滴水落进大海里，无人在意。</p>
            <p>有时她会回想起在星炬学院度过的那些时光。那个在人群中露出意料之外的笑脸的女孩，那些留在别人记忆里轻笑的，或是懒散或是慌张的女孩——那真的是她吗？</p>
            <p>但，那又不是她吗？</p>
          </div>
          <div class="component-content-text story-content" v-show="activeStoryTab === 2">
            <p><strong class="text-bronze" style="font-size:18px">明昼</strong></p>
            <hr class="skill-divider" />
            <p>笑是一种很方便的工具，它能以廉价的方式拉进你和别人的距离。</p>
            <p>&nbsp;</p>
            <p>第一次见到西格莉卡是在某次分组课题里，那时达妮娅坐在教室的一角，用手指盘卷着耳畔的头发，窥视着同学们两两组队时的样子。</p>
            <p>午后的微风吹过门廊，将载具场的车声，广场的喧嚣声糅杂起来，吹动墙上飞行雪绒歌友会的海报，发出噼啪声响。</p>
            <p>一个拘谨的声音忽然找到了她，将她从片刻的惬意中惊醒。</p>
            <p>"你愿意和我一起完成课题吗，达妮娅同学？"</p>
            <p>达妮娅转过头，看到了那位双手倒剪在身后的橙发少女。她习惯性地歪了歪头，确认对方的确是在询问自己后，便将脸上的笑容抹得更深了些，回应道："当然可以呀，不过，你为什么会找到我呢，西格莉卡？"</p>
            <p>西格莉卡告诉她：虽然达妮娅喜欢一个人来往，但在看到同学们吵闹时却会露出幸福的微笑，所以，她觉得达妮娅应该是个很温柔的人。她想和这样的人成为朋友。</p>
            <p>温柔。</p>
            <p>达妮娅后来仔细研究过这个词的含义，在听到了会长的解释以后，她确信这个词用在她身上有强烈的讽刺意味。</p>
            <p>如果能让未来的达妮娅再选一次，或许她会拒绝那个请求吧。不曾相遇，便少了许多麻烦。</p>
            <p>可那一刻她却只是点了点头，笑着和西格莉卡说，"好"。</p>
            <p>&nbsp;</p>
            <p>前些天，娜斯塔霞和她讲过的话仍停留在耳畔——其实大多数人并不是不害怕死亡……大家只是，尽量不去想。</p>
            <p>不去想，不去看，不去听，不去思考。</p>
            <p>达妮娅发现，在星炬学院里似乎有什么横亘在人们与死亡之间，为人们遮蔽了它。</p>
            <p>白昼里青春奔忙，每分每秒都有新事物等待发掘；而到了夜晚，人们仰望星图，观看被莫宁教授投影出来的梦想——人们就这样被幸福遮蔽了感知，无法认清祂眼瞳里的残忍真相。</p>
            <p>可是，梦终究会醒。祂总有一天会来。</p>
            <p>那时娜斯塔霞揉着她的头发，告诉她，其实大多数孩子是不会思考这些事情的，你还年轻，还有很棒的未来去见证，你应该像其他同龄人一样更吵闹更快乐一点，而不是每天躲在图书馆里补觉，或者和她这个图书管理员探讨很悲伤的话题。</p>
            <p>"死亡是人生的终极命题，可你思考这些思考得太早了，达妮娅。你还没找到那条真正属于你的道路。"</p>
            <p>&nbsp;</p>
            <p>达妮娅不知道娜斯塔霞那时说的话是什么意思。她能做的，只有自那以后越来越少地出现在那里。</p>
            <p>她不想让娜斯塔霞悲伤。</p>
          </div>
          <div class="component-content-text story-content" v-show="activeStoryTab === 3">
            <p><strong class="text-bronze" style="font-size:18px">群魔</strong></p>
            <hr class="skill-divider" />
            <p>会长身边的人，或多或少都听过那个老套的故事。</p>
            <p>从前，有个阴差阳错地成了大英雄的蠢货，他为了拯救那些陷入苦难的人，背负了不该属于自己的、难以想象的代价……</p>
            <p>会监们对故事主人公的态度各不相同。嘲弄，憎恶，感慨，遗憾——有的付之一笑，有的听若惘闻。</p>
            <p>&nbsp;</p>
            <p>而会长口中那个能招来奇迹的名字，于达妮娅而言却只是个遥远而模糊的谎言。</p>
            <p>达妮娅不知道自己能否算"陷入苦难的人"，只是当她提起那个人时，会长带着几分哂笑与自嘲地和她说：其实我也觉得他应该出现在这。不过既然他没来，也就说明他或许并不如你祈望的那般全知全能。</p>
            <p>可惜啊，达妮娅，看来你所需要的那个神，却并不需要你啊。</p>
            <p>&nbsp;</p>
            <p>可其实达妮娅从未觉得那应该是她的神。她只觉得那个人很可怜。</p>
            <p>如果一切真如会长所说，那么被奉为救世主的人，也不过是同样被束缚在框架里的囚徒，不过是被遗弃在世界上的，会流血，会悲伤，会死去的人。</p>
            <p>也正因此，会长和那个人都没能理解的一件事就是——哪怕那时没有会长留给她的命令，她同样会选择挡在隧锚前。</p>
            <p>因为达妮娅得不到答案。</p>
            <p>如果追求理想的人注定支付更多代价，那是不是说明那个理想本身就是错的？</p>
            <p>毕竟，在那个人看不见的角落里，总有人遵循着更精致的规则生存，他们利用、背叛，一边享用着这个被所守护的世界，一边嘲弄着那些冲向风暴的人。<br/>为什么世界总是对善良的人露出獠牙？为什么总是那些用价值衡量一切的人笑到最后？</p>
            <p>而一个连自己的过去都能轻易抛弃的人，又到底是为了什么，才会放弃如今来之不易的一点幸福，去替所有人面对阿列夫一这样荒诞恐怖的事物？</p>
            <p>只是为了守护吗？但又有谁能理解？当那个人倒下之后又该如何？</p>
            <p>当深空联合的计划已经能救下大多数人时……那个人在坚持的东西，又到底是什么？</p>
            <p>&nbsp;</p>
            <p>很多时候，达妮娅藏在层层伪装后的思维并不复杂。</p>
            <p>她只是觉得，在那个人、这个世界，或者她自己之间，至少有一个出了问题。</p>
          </div>
          <div class="component-content-text story-content" v-show="activeStoryTab === 4">
            <p><strong class="text-bronze" style="font-size:18px">谎言</strong></p>
            <hr class="skill-divider" />
            <p>达妮娅的意识在黑暗中无限坠落。</p>
            <p>&nbsp;</p>
            <p>将阿列夫一的最后一块碎片收纳进声痕后，她便再难维系自己的存在形式。虚质又一次淹没了她，就像过去千百次体验过的那样，意识一点点变得缓慢，时间被拉得绵长。</p>
            <p>是啊，开始和结尾总是如此相似，一切都刚刚好，足以结成一个完美的圆。</p>
            <p>可又与当初来到这里时不同——达妮娅发现自己不知为何停止了颤抖。呼吸变得平稳，胸腔内不再满是忧怖。</p>
            <p>再次对视时，她向着那只空洞眼眸缓缓地伸出手。随后，尝试触碰什么的手攥在一起，她将食指和中指张开，对着瞳孔的正中央，做了一个瞄准的手势。</p>
            <p>她发现原来阿列夫一是这样可笑的存在。</p>
            <p>在无意义的世界中诞生的神明，自然也无法拥有任何东西。虚无的本能驱使祂渴望一切，但无论吞下什么，毁灭什么，祂都还是那副样子，在永恒寂静的世界里孤独地渴求，永远得不到餍足，留不下任何事物。</p>
            <p>&nbsp;</p>
            <p>作为嘲弄的依据，达妮娅觉得自己与祂的根本区别就是：如今她已有了一颗属于自己的心。</p>
            <p>即便那颗心渺小，脆弱，在时间的尺度上，转瞬即逝。</p>
            <p>但就这样一颗毫无意义的心，让她开始像其他人一样期待起明天。</p>
            <p>总有人心甘情愿地为了一个谎言活着，就像某个令她挂碍的、讨厌的人说的那样，其实，是心决定着我们是谁。而一旦有了一颗心，人也就有了选择权。就像人类庆祝生日，是因为自那一天以后，人短暂地获得记忆与形体，得以从虚无中逃离。随后，人类会感受世界与幸福，与他人建立联系，用来创造一些虚无以外的东西。</p>
            <p>&nbsp;</p>
            <p>此刻，达妮娅闭上眼睛，想象起那些仍在索拉里斯大地上奔走的朋友——西格莉卡在日落的原野上追逐飞鸟，娜斯塔霞在图书馆整理老去的典籍，而那个被自己欺骗过的、常年漂泊的人，正收拾着行囊，即将奔赴远方。</p>
            <p>达妮娅忽然觉得有些好笑，她想学着那个人的语气一本正经地说：</p>
            <p>"愿他们每个人都幸福、快乐、自由。</p>
            <p>愿他们每个人都能实现自己的愿望。"</p>
            <p>但话到嘴边，又觉得矫情。</p>
            <p>于是，这样就好。</p>
            <p>这世上真正属于达妮娅的东西很少，但至少现在，不再作为什么容器，什么样本，什么筹码，也无关那些被赋予的虚无、命令与谎言。</p>
            <p>她只是衷心地祝愿。自此以后，她将与他们同在，再不分离。</p>
            <p>达妮娅，已找到自己的路。</p>
            <p>——</p>
            <p>砰。</p>
            <p>像一场玩笑——无限坠落的黑暗，忽地有了尽头。</p>
            <p>昏冥中，有人轻轻叹了口气，似是等了许久。</p>
            <p>&nbsp;</p>
          </div>
        </div>
      </div>
    </div>

  <!-- 模块：角色攻略 -->
  <div id="character-guide" class="module glass-panel">
    <h2 class="module-title">角色攻略</h2>
    <p class="guide-notice">攻略内容仅供当期参考</p>

    <!-- 战斗风格 -->
    <div id="guide-battle-style" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideBattleStyle')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">战斗风格</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideBattleStyle">
        <table class="info-table battle-table">
          <colgroup><col style="width:15%"/><col style="width:85%"/></colgroup>
          <tbody>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/a73a1f65f9084169b679effb13adfa0020260424.png" width="64" alt="" /></td><td class="value-cell"><strong>快速协奏</strong><br/>拥有较高的协奏效率</td></tr>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f2186ee796e246ce86b71c9e6e6a061820260424.png" width="64" alt="" /></td><td class="value-cell"><strong>共鸣解放伤害</strong><br/>共鸣解放伤害较高</td></tr>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/ee7e086eb138499abcd51c435c1e6a5020260424.png" width="64" alt="" /></td><td class="value-cell"><strong>牵引</strong><br/>可以将一定范围内的目标牵引至特定位置</td></tr>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/4fe87c9e8fa9451bbe90c4c5ebb005bf20260424.png" width="64" alt="" /></td><td class="value-cell"><strong>聚爆</strong><br/>可以运用聚爆效应</td></tr>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/1ffb8741df8940cebc17784b789ca79b20260424.jpg" width="64" alt="" /></td><td class="value-cell"><strong>谐度破坏增幅</strong><br/>可以提升队伍内特定角色的谐度破坏增幅</td></tr>
            <tr><td class="battle-icon-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/c2b17d065da342199bba632253712a6920260424.jpg" width="64" alt="" /></td><td class="value-cell"><strong>集谐响应</strong><br/>根据自身谐度破坏增幅对目标造成最终伤害提升</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 角色养成 -->
    <div id="guide-build" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideBuild')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">角色养成</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideBuild">
        <table class="info-table" style="margin-bottom:1rem"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
          <tr><td class="label-cell"><strong>加点推荐</strong></td><td class="value-cell"><strong>固有技能&gt;共鸣解放&gt;共鸣回路&gt;大攻击/大暴击&gt;共鸣技能&gt;常态攻击＞变奏技能</strong></td></tr>
        </tbody></table>
        <table class="info-table" style="margin-bottom:1rem"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
          <tr><td class="label-cell"><strong>突破材料</strong></td><td class="value-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/b06d865346bf4719a0ee326250d13f2d20260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/9f2c38abd5c04c1790cd8588e1fa1a1820260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/993db1162ac240ed8b40a56dbd3f6c5420260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/e81eaddc002c4dcbaf09ed401d13989f20260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/2d9fcb08ce57487592338eb8e1a6dcb320260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/81e294cf63f44fceb89377bced6be88920260427.png" width="92" alt="" /></td></tr>
          <tr><td class="label-cell"><strong>技能材料</strong></td><td class="value-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/f7923b4fc9fc43d990265cd71c38652820260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/bef1ceb574d64e20986318493434c51020260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/094d1d12dab247fe970eb1576414012120260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/ba482d06f289446ca1decdfb1dae3eae20260131.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/ed7176125f834e13beda6272f1abf01720260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/9b4f00d040064f8a98af812c0d3d62fa20260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/21e5a6fecf6345b8b37d9da5e76ebe3e20260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/60543603a07647d7964b0eb4ecaa984120260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/f3793f2c990f403cb1d1e8f9ba9cd7ca20260427.png" width="92" alt="" /></td></tr>
          <tr><td class="label-cell"><strong>专武材料</strong></td><td class="value-cell"><img src="https://prod-alicdn-community.kurobbs.com/forum/ab37cca63e054b889113a05dc846395c20260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/b0855a99440140d08cfeead1965a9bf920260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/20c432e4039c4d35825366c1e0c141b020260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/d983d96465a44577b81a8749d615529420260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/2c6abdfaf93c4a2b8349a92eb40557f920260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/e549f8c10e14449580bac8027a3b3cf420260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/c098188b5d3c4b9abfa2ede648c232f820260427.png" width="92" alt="" /> <img src="https://prod-alicdn-community.kurobbs.com/forum/40e70b72985d4330ab137947c26de87120260427.png" width="92" alt="" /></td></tr>
        </tbody></table>
      </div>
    </div>

    <!-- 角色机制 -->
    <div id="guide-mechanics" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideMechanics')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">角色机制</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideMechanics">
        <div class="stat-tabs">
          <button class="stat-tab" :class="{ active: activeMechanicsTab === 0 }" @click="activeMechanicsTab = 0">核心机制</button>
          <button class="stat-tab" :class="{ active: activeMechanicsTab === 1 }" @click="activeMechanicsTab = 1">输出流程</button>
        </div>
        <div class="component-content-text" v-show="activeMechanicsTab === 0">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>核心机制</strong></td><td class="value-cell">
              <ul style="list-style:disc;padding-left:1.5rem;margin:0">
                <li>处于<strong class="text-gold">【布景之形】</strong>时，攻击可获得<strong class="text-gold">【虚质粒子】</strong>。</li>
                <li>处于<strong class="text-gold">【幻灭之形】</strong>时，攻击可消耗<strong class="text-gold">【虚质粒子】</strong>转化为<strong class="text-gold">【共形能量】</strong>，为<strong class="text-gold">【帷幕终景·幻灭之形】</strong>充能。</li>
                <li>处于<strong class="text-gold">熵变强化</strong>状态时，随时间获得<strong class="text-gold">【黯核】</strong>，可用于释放<strong class="text-gold">强化共鸣技能</strong>。</li>
                <li>释放<strong class="text-gold">共鸣解放·布景之形</strong>，达妮娅会获得<strong class="text-gold">熵变强化·幻灭之形</strong>，提升攻击。<br/>释放<strong class="text-gold">共鸣解放·幻灭之形</strong>，达妮娅会获得<strong class="text-gold">熵变强化·布景之形</strong>，持续回复<strong class="text-gold">【虚质粒子】</strong>。</li>
                <li>为队伍中角色提供伤害加成效果。</li>
                <li>处于<strong class="text-gold">共鸣模态·聚爆</strong>时，拥有高频附加<strong class="text-gold">【聚爆效应】</strong>的能力，并可提升聚爆效应体系队伍的伤害。</li>
                <li>处于<strong class="text-gold">共鸣模态·集谐</strong>时，拥有附加<strong class="text-gold">【集谐·偏移】</strong>、刷新<strong class="text-gold">【集谐·干涉】</strong>持续时间、快速积攒<strong class="text-gold">【偏谐值】</strong>的能力，并可提升集谐响应体系队伍的伤害。</li>
              </ul>
            </td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeMechanicsTab === 1">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>输出流程</strong></td><td class="value-cell">
              <p><strong>基础流程：R-EE-AAAA-R-Q（满协奏切人）</strong></p>
              <p style="color:#7e8c8d;font-size:14px">技能缩写：普攻--A，重击--Z，共鸣技能--E，共鸣解放--R，声骸--Q</p>
            </td></tr>
          </tbody></table>
        </div>
      </div>
    </div>

    <!-- 声骸套装推荐 -->
    <div id="guide-echo" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideEcho')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">声骸套装推荐</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideEcho">
        <div class="stat-tabs">
          <button class="stat-tab" :class="{ active: activeEchoTab === 0 }" @click="activeEchoTab = 0">主流声骸</button>
          <button class="stat-tab" :class="{ active: activeEchoTab === 1 }" @click="activeEchoTab = 1">斑驳粉饰之沫</button>
          <button class="stat-tab" :class="{ active: activeEchoTab === 2 }" @click="activeEchoTab = 2">剪心辑梦之影</button>
        </div>
        <div class="component-content-text" v-show="activeEchoTab === 0">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong><img src="https://prod-alicdn-community.kurobbs.com/forum/abefff652e4e4c10b60479d394394f3620260423.png" width="32" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1468619762249129984" target="_blank">斑驳粉饰之沫</a></strong></td><td class="value-cell"><a href="https://wiki.kurobbs.com/mc/item/1498439403399122944" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/4626acccbf5047d2a8ed7b4d048d2a5120260508.png" width="92" alt="" /></a></td></tr>
            <tr><td class="label-cell"><strong><img src="https://prod-alicdn-community.kurobbs.com/forum/fb3b3798387b479db72bafb6e4b4d74820260423.png" width="32" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498480264495570944" target="_blank">剪心辑梦之影</a></strong></td><td class="value-cell"><a href="https://wiki.kurobbs.com/mc/item/1498470175877439488" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/a30f809da70d44fa8650dc1a7b88520c20260423.png" width="92" alt="" /></a></td></tr>
            <tr><td class="label-cell"><strong>COST分配</strong></td><td class="value-cell"><strong>毕业：43311</strong></td></tr>
            <tr><td class="label-cell"><strong>COST主词条</strong></td><td class="value-cell"><p><strong>COST4：</strong>暴击 / 暴击伤害</p><p><strong>COST3：</strong>双热熔伤害加成 / 热熔伤害加成+攻击</p><p><strong>COST1：</strong>攻击</p></td></tr>
            <tr><td class="label-cell"><strong>声骸词条</strong></td><td class="value-cell"><strong>暴击=暴击伤害＞攻击&gt;共鸣解放&gt; 共鸣效率（推荐效率120%以上）</strong></td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeEchoTab === 1">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong><img src="https://prod-alicdn-community.kurobbs.com/forum/abefff652e4e4c10b60479d394394f3620260423.png" width="32" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1468619762249129984" target="_blank">斑驳粉饰之沫</a></strong></td><td class="value-cell"><p><strong>二件套：</strong>热熔伤害提升10%</p><p><strong>五件套：</strong>角色为敌人添加<strong style="color:#ba932d">【聚爆效应】</strong>时，自身获得下述效果：热熔伤害提升10%，持续15秒。持续期间内施放延奏技能后，下一个变奏技能登场的角色热熔伤害提升25%，持续15秒。</p></td></tr>
            <tr><td class="label-cell"><a href="https://wiki.kurobbs.com/mc/item/1498439403399122944" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/4626acccbf5047d2a8ed7b4d048d2a5120260508.png" width="92" alt="" /></a></td><td class="value-cell"><p>使用声骸技能，召唤<strong style="color:#ba932d">【骗术师】</strong>，对敌人造成<strong class="text-red">273.60%</strong>的热熔伤害。</p><p>在此后15秒内，若自身施放延奏技能，使下一个变奏技能登场的角色热熔伤害加成提升<strong class="text-red">12.00%</strong>，持续15秒。</p><p>技能冷却：20秒</p></td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeEchoTab === 2">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong><img src="https://prod-alicdn-community.kurobbs.com/forum/fb3b3798387b479db72bafb6e4b4d74820260423.png" width="32" alt="" /><br/><a href="https://wiki.kurobbs.com/mc/item/1498480264495570944" target="_blank">剪心辑梦之影</a></strong></td><td class="value-cell"><p><strong>二件套：</strong>攻击力提升10%</p><p><strong>五件套：</strong>角色为敌人添加<strong style="color:#ba932d">【震谐·偏移】</strong>或<strong style="color:#ba932d">【集谐·偏移】</strong>时，队伍中角色谐度破坏增幅提升20点，持续30秒，同名效果之间不可叠加。</p></td></tr>
            <tr><td class="label-cell"><a href="https://wiki.kurobbs.com/mc/item/1498470175877439488" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/a30f809da70d44fa8650dc1a7b88520c20260423.png" width="92" alt="" /></a></td><td class="value-cell"><p>对周围敌人造成<strong style="color:#f3c40f">405.00%</strong>的衍射伤害。</p><p>长按声骸技能，持续攻击敌人造成至多十二段<strong style="color:#f3c40f">49.33%</strong>的衍射伤害。使用该声骸技能后15秒内，若自身施放延奏技能，使下一个变奏技能登场的角色攻击提升<strong style="color:#ba932d">12.00%</strong>，持续15秒。</p><p>技能冷却：25秒</p></td></tr>
          </tbody></table>
        </div>
      </div>
    </div>

    <!-- 武器推荐 -->
    <div id="guide-weapon" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideWeapon')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">武器推荐</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideWeapon">
        <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
          <tr><td class="label-cell"><strong>武器推荐</strong></td><td class="value-cell">
            <p><a href="https://wiki.kurobbs.com/mc/item/1506107908334694400" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/2b7aa757a3884f2cb1a6fc55657dd50620260422.png" width="92" alt="" /></a> <a href="https://wiki.kurobbs.com/mc/item/1237354288028385280" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/41923b21369d4ac79dec84473ccf2d4f20250105.png" width="92" alt="" /></a> <a href="https://wiki.kurobbs.com/mc/item/1237352221406724096" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/a16aeafc88c0412eb2bd8b89bcb857c120250105.png" width="92" alt="" /></a></p>
            <p><a href="https://wiki.kurobbs.com/mc/item/1506107908334694400" target="_blank">赝作的矮星</a>&gt;<a href="https://wiki.kurobbs.com/mc/item/1237354288028385280" target="_blank">掣傀之手</a>&gt;<a href="https://wiki.kurobbs.com/mc/item/1237352221406724096" target="_blank">漪澜浮录</a></p>
            <p style="color:#7e8c8d;font-size:14px">无特别说明，武器默认1阶</p>
          </td></tr>
          <tr><td class="label-cell"><a href="https://wiki.kurobbs.com/mc/item/1506107908334694400" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/2b7aa757a3884f2cb1a6fc55657dd50620260422.png" width="92" alt="" /></a></td><td class="value-cell">
            <p><a href="https://wiki.kurobbs.com/mc/item/1506107908334694400" target="_blank"><strong style="color:#843fa1;font-size:18px">寂静</strong></a></p>
            <p>谐振(<strong style="color:#bea466">1/2/3/4/5</strong>)阶</p>
            <p>攻击力提升(<strong style="color:#bea466">12%/15%/18%/21%/24%</strong>)。附加聚爆效应或集谐·偏移时，共鸣解放伤害加成提升(<strong style="color:#ba932d">36%/45%/54%/63%/72%</strong>)，持续5秒。该效果生效期间，队伍中的角色附加聚爆效应或集谐·偏移时，该角色攻击提升(<strong style="color:#ba932d">24%/30%/36%/42%/48%</strong>)，持续15秒，<strong>同名效果之间不可叠加</strong>。</p>
          </td></tr>
          <tr><td class="label-cell"><a href="https://wiki.kurobbs.com/mc/item/1237354288028385280" target="_blank"><img src="https://prod-alicdn-community.kurobbs.com/forum/41923b21369d4ac79dec84473ccf2d4f20250105.png" width="92" alt="" /></a></td><td class="value-cell">
            <p><a href="https://wiki.kurobbs.com/mc/item/1237354288028385280" target="_blank"><strong style="color:#ac2e38;font-size:18px">密电增幅</strong></a></p>
            <p>谐振(<strong style="color:#bea466">1/2/3/4/5</strong>)阶</p>
            <p>全属性伤害加成提升(<strong style="color:#bea466">12%/15%/18%/21%/24%</strong>)。造成共鸣技能伤害时，自身攻击提升(<strong style="color:#ba932d">12%/15%/18%/21%/24%</strong>)，可叠加2层，效果持续5秒。自身不在场时，该效果攻击额外提升(<strong style="color:#bea466">12%/15%/18%/21%/24%</strong>)</p>
          </td></tr>
        </tbody></table>
      </div>
    </div>

    <!-- 编队&队伍轴推荐 -->
    <div id="guide-team" class="info-component">
      <div class="component-header" :style="{ background: '#EFEDEA' }" @click="toggleCollapse('guideTeam')">
        <div class="component-header-bg" :style="{ backgroundImage: `url(https://prod-alicdn-community.kurobbs.com/forum/wikimcbg.png)` }"></div>
        <div class="component-header-content">
          <span class="component-title-text">编队&amp;队伍轴推荐</span>
          <button class="collapse-btn"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99932 5.82861H7.1709L9.99932 8.65704L12.8278 5.82861H9.99932ZM19.9706 5.99995H15.6525L9.96501 11.6875L4.27749 5.99995H0.0293579L7.84094 13.8115L7.84089 13.8116L9.99993 15.9706L19.9706 5.99995Z" fill="#BB9F5E"/></svg></button>
        </div>
      </div>
      <div class="component-body" v-show="!collapseState.guideTeam">
        <div class="stat-tabs">
          <button class="stat-tab" :class="{ active: activeTeamTab === 0 }" @click="activeTeamTab = 0">主流队友</button>
          <button class="stat-tab" :class="{ active: activeTeamTab === 1 }" @click="activeTeamTab = 1">爱弥斯+千咲</button>
          <button class="stat-tab" :class="{ active: activeTeamTab === 2 }" @click="activeTeamTab = 2">爱弥斯+千咲（二链）</button>
          <button class="stat-tab" :class="{ active: activeTeamTab === 3 }" @click="activeTeamTab = 3">陆·赫斯+千咲</button>
        </div>
        <div class="component-content-text" v-show="activeTeamTab === 0">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>角色图鉴</strong></td><td class="value-cell"><strong><a href="https://wiki.kurobbs.com/mc/item/1488852222116831232?wkFrom=catalog" target="_blank" style="color:#e67e23;font-size:18px;text-decoration:underline">&gt;&gt;点击查看【达妮娅角色图鉴】</a></strong></td></tr>
            <tr><td class="label-cell"><strong>队伍组成</strong></td><td class="value-cell"><strong><a href="https://wiki.kurobbs.com/mc/item/1457744312692867072?wkFrom=catalog" target="_blank">爱弥斯</a>+<a href="https://wiki.kurobbs.com/mc/item/1488852222116831232?wkFrom=catalog" target="_blank">达妮娅</a>+<a href="https://wiki.kurobbs.com/mc/item/1429457793942482944?wkFrom=catalog" target="_blank">千咲</a></strong><br/>----------------------------<br/><strong><a href="https://wiki.kurobbs.com/mc/item/1457750329618771968?wkFrom=catalog" target="_blank">陆·赫斯</a>+<a href="https://wiki.kurobbs.com/mc/item/1488852222116831232?wkFrom=catalog" target="_blank">达妮娅</a>+<a href="https://wiki.kurobbs.com/mc/item/1429457793942482944?wkFrom=catalog" target="_blank">千咲</a></strong></td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeTeamTab === 1">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>队伍组成</strong></td><td class="value-cell"><strong>爱弥斯+达妮娅+千咲</strong></td></tr>
            <tr><td class="label-cell"><strong>输出轴</strong></td><td class="value-cell"><p><strong>爱弥斯</strong>→R-E-E-Q（满协奏切人）</p><p><strong>千咲</strong>→变奏入场→E（满协奏切人）</p><p><strong>达妮娅</strong>→变奏入场→R-E-E-AAAA-R-Q（满协奏切人）</p></td></tr>
            <tr><td class="label-cell"><strong>核心</strong></td><td class="value-cell">角色通过<strong style="color:#ca9f5e">共鸣解放</strong>在短时间内对目标造成大量<strong class="text-red">热熔伤害</strong>。</td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeTeamTab === 2">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>队伍组成</strong></td><td class="value-cell"><strong>爱弥斯（二链）+达妮娅+千咲</strong></td></tr>
            <tr><td class="label-cell"><strong>输出轴</strong></td><td class="value-cell"><p>爱弥斯二链解锁后，达妮娅登场前可多积累一层增伤。</p></td></tr>
          </tbody></table>
        </div>
        <div class="component-content-text" v-show="activeTeamTab === 3">
          <table class="info-table"><colgroup><col style="width:17%"/><col style="width:83%"/></colgroup><tbody>
            <tr><td class="label-cell"><strong>队伍组成</strong></td><td class="value-cell"><strong>陆·赫斯+达妮娅+千咲</strong></td></tr>
            <tr><td class="label-cell"><strong>输出轴</strong></td><td class="value-cell"><p><strong>陆·赫斯</strong>→R-E-Q（满协奏切人）</p><p><strong>千咲</strong>→变奏入场→E（满协奏切人）</p><p><strong>达妮娅</strong>→变奏入场→R-E-E-AAAA-R-Q（满协奏切人）</p></td></tr>
            <tr><td class="label-cell"><strong>核心</strong></td><td class="value-cell">陆·赫斯提供聚爆效应增幅，配合达妮娅的热熔输出。</td></tr>
          </tbody></table>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- 全屏图片展示 -->
  <Teleport to="body">
    <div v-if="fullscreenImage" class="fullscreen-overlay" @click="closeFullscreen">
      <img :src="fullscreenImage" alt="" />
    </div>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const currentBanner = ref('/image/archive.jpeg')
const isNavCollapsed = ref(false)
const activeImageTab = ref(0)
const activeStatTab = ref(0)
const activeSkillTab = ref(0)
const activeBreakthroughTab = ref(0)
const activeSkillMaterialTab = ref(0)
const skillMaterialTabs = ['常态攻击', '共鸣技能', '共鸣回路', '共鸣解放', '变奏技能']
const activePreciousTab = ref(0)
const preciousItemTabs = ['「骗术师」', '星炬纪念相册', '「造梦者」', '特殊料理']
const activeStoryTab = ref(4)
const storyTabs = ['礼物', '荒芜', '明昼', '群魔', '谎言']
const activeMechanicsTab = ref(0)
const activeEchoTab = ref(0)
const activeTeamTab = ref(0)

const roleBg = ref('https://prod-alicdn-community.kurobbs.com/forum/cbe1a0d853d14e5aaac4c84c7d28e74d20260401.png?x-oss-process=image/format,webp')
const attrIcon = ref('https://prod-alicdn-community.kurobbs.com/forum/a8a304ec837d4c22bc13cc7aa3c7f72420260401.png')

const roleImages = ref([
  'https://prod-alicdn-community.kurobbs.com/forum/176a32e3cefe47a4a29819d033a306cc20260521.png?x-oss-process=image/format,webp',
  'https://prod-alicdn-community.kurobbs.com/forum/625294f4d0b740f4bf5ce693ddb0b35920260521.png?x-oss-process=image/format,webp',
  'https://prod-alicdn-community.kurobbs.com/forum/492b30d224bf47429e8aa73a9cfd104a20260521.png?x-oss-process=image/format,webp'
])

const statTabs = ['1', '20', '40', '50', '60', '70', '80', '90']

const statTables = [
  // Lv 1
  [
    ['无突破', '无突破', '', '攻击提升', '0%（12%）'],
    ['基础生命', '882', '', '暴击伤害', '150%（166%）'],
    ['基础攻击', '34', '', '治疗效果加成', '0%'],
    ['基础防御', '94', '', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 20
  [
    ['一阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '2294', '2882', '暴击伤害', '150%（166%）'],
    ['基础攻击', '88', '113', '治疗效果加成', '0%'],
    ['基础防御', '241', '302', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 40
  [
    ['二阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '4368', '4956', '暴击伤害', '150%（166%）'],
    ['基础攻击', '171', '196', '治疗效果加成', '0%'],
    ['基础防御', '456', '517', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 50
  [
    ['三阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '5699', '6287', '暴击伤害', '150%（166%）'],
    ['基础攻击', '225', '250', '治疗效果加成', '0%'],
    ['基础防御', '595', '656', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 60
  [
    ['四阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '7031', '7619', '暴击伤害', '150%（166%）'],
    ['基础攻击', '279', '305', '治疗效果加成', '0%'],
    ['基础防御', '733', '794', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 70
  [
    ['五阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '8362', '8950', '暴击伤害', '150%（166%）'],
    ['基础攻击', '333', '350', '治疗效果加成', '0%'],
    ['基础防御', '872', '933', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 80
  [
    ['六阶突破', '突破前', '突破后', '攻击提升', '0%（12%）'],
    ['基础生命', '9693', '10281', '暴击伤害', '150%（166%）'],
    ['基础攻击', '379', '396', '治疗效果加成', '0%'],
    ['基础防御', '1010', '1071', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ],
  // Lv 90
  [
    ['满突破', '满突破', '', '攻击提升', '0%（12%）'],
    ['基础生命', '11025', '', '暴击伤害', '150%（166%）'],
    ['基础攻击', '425', '', '治疗效果加成', '0%'],
    ['基础防御', '1148', '', '最大共鸣能量', '125'],
    ['暴击率', '5%', '', '热熔伤害提升', '0%']
  ]
]

const skillTabs = ['常态攻击', '共鸣技能', '共鸣回路', '共鸣解放', '变奏技能', '延奏技能', '谐度破坏']

const collapseState = reactive({
  otherInfo: false,
  stats: false,
  battleStyle: true,
  skillDesc: false,
  skillIntro: false,
  resonanceChain: false,
  breakthrough: false,
  skillMaterial: false,
  abilityReport: false,
  preciousItems: false,
  characterStory: false,
  guideBattleStyle: false,
  guideBuild: false,
  guideMechanics: false,
  guideEcho: false,
  guideWeapon: false,
  guideTeam: false
})

const toggleCollapse = (key: keyof typeof collapseState) => {
  collapseState[key] = !collapseState[key]
}

const breakthroughTabs = ['一阶突破', '二阶突破', '三阶突破', '四阶突破', '五阶突破', '六阶突破']

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}

const navExpanded = ref('')

const toggleNavGroup = (group: string) => {
  navExpanded.value = navExpanded.value === group ? '' : group
}

const fullscreenImage = ref<string | null>(null)

const onImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG' && target.getAttribute('src')) {
    e.stopPropagation()
    fullscreenImage.value = target.getAttribute('src')
  }
}

const closeFullscreen = () => {
  fullscreenImage.value = null
}
</script>

<style scoped>
.wiki-view {
  width: 100vw;
  height: 100vh;
  overflow-y: overlay;
  overflow-x: hidden;
  pointer-events: auto;
  scroll-behavior: smooth;
}

.wiki-view::-webkit-scrollbar {
  width: 6px;
}
.wiki-view::-webkit-scrollbar-thumb {
  background: rgba(var(--c-pink), 0.3);
  border-radius: 10px;
}

/* Banner */
.banner-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center 20%;
  background-attachment: fixed;
  box-shadow: inset 0 -150px 100px -50px rgba(10, 5, 10, 0.9);
}

/* Hero 大标题 */
.wiki-hero {
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.wiki-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3rem;
  text-shadow: 0 0 30px rgba(var(--c-pink), 0.6), 0 0 60px rgba(var(--c-deep-blue), 0.3);
  margin: 0;
}

.wiki-subtitle {
  font-size: clamp(1.85rem, 2.4vw, 1.1rem);
  color: rgba(241, 213, 224, 0.842);
  letter-spacing: 0.08rem;
  margin-top: 1rem;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.2);
}

.banner-actions {
  position: absolute;
  top: 66.6%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  z-index: 10;
}

.banner-btn {
  background: rgba(20, 10, 20, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--c-pink), 0.5);
  color: #fff;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(228, 144, 179, 0.4), inset 0 0 10px rgba(var(--c-pink), 0.2);
  transition: all 0.3s ease;
}

.banner-btn:hover {
  background: rgba(var(--c-pink), 0.3);
  border-color: rgba(var(--c-pink), 0.8);
  box-shadow: 0 5px 25px rgba(var(--c-pink), 0.6), inset 0 0 15px rgba(var(--c-pink), 0.4);
  transform: translateY(-3px);
}

/* 主内容区 */
.content-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 6rem 2rem;
  background: linear-gradient(180deg, rgba(10, 5, 10, 0.9) 0%, rgba(var(--c-purple), 0.4) 100%);
}

/* 模块容器 */
.module {
  width: 100%;
  max-width: 1400px;
  border-radius: 16px;
  background: rgba(20, 10, 20, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(var(--c-pink), 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 3rem 4vw;
}

.module-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: #fff;
  text-align: center;
  margin: 0 0 2rem 0;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 20px rgba(var(--c-pink), 0.6);
}

.guide-notice {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: -1rem 0 2rem 0;
  letter-spacing: 0.05rem;
}

/* 角色展示组件 */
.role-component {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.role-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 500px;
}

.role-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.role-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.role-images {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.role-images .figure {
  display: none;
}

.role-images .figure.figure-visible {
  display: block;
}

.role-images .figure img {
  max-height: 600px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(var(--c-pink), 0.15));
}

.role-profile {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.attr-icon {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 0 10px rgba(var(--c-pink), 0.6));
}

.name-block {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0;
  color: #fff;
  letter-spacing: 0.2rem;
  text-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
}

.name-en {
  font-size: 1.2rem;
  color: rgb(var(--c-light-blue));
  letter-spacing: 0.4rem;
  margin-top: 4px;
}

.hr-line {
  width: 340px;
  max-width: 100%;
  margin: 1.5rem 0;
}

.lore-title {
  color: rgb(var(--c-pink));
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.1rem;
  margin-bottom: 0.8rem;
}

.lore-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  line-height: 1.8;
  letter-spacing: 0.05rem;
  font-weight: 300;
}

.tags-block {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag {
  background: rgba(var(--c-deep-blue), 0.3);
  border: 1px solid rgba(var(--c-light-blue), 0.4);
  color: rgb(var(--c-light-blue));
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
}

/* 立绘切换标签 */
.role-tabs {
  width: 100%;
  display: flex;
  gap: 0.8rem;
  padding-top: 1rem;
}

.role-tab {
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(var(--c-pink), 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(20, 10, 20, 0.5);
}

.role-tab.active, .role-tab:hover {
  background: rgba(var(--c-pink), 0.25);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.3);
}

/* 信息组件 */
.info-component {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(var(--c-pink), 0.1);
}

.component-header {
  position: relative;
  padding: 0.8rem 1.5rem;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

.component-header-bg {
  position: absolute;
  inset: 0;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: 100% 0;
  opacity: 0.6;
}

.component-header-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-title-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
}

.collapse-btn.active {
  transform: rotate(180deg);
}

.component-body {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.component-content-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

/* 表格 */
.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgba(var(--c-pink), 0.15);
}

.info-table td, .info-table th {
  padding: 8px;
  border: 1px solid rgba(var(--c-pink), 0.1);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
}

.label-cell {
  background: rgba(var(--c-deep-blue), 0.15);
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.value-cell {
  color: rgba(255, 255, 255, 0.8);
}

.value-cell a {
  color: rgb(var(--c-light-blue));
}

/* 统计标签 */
.stat-tabs, .skill-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stat-tab, .skill-tab {
  min-width: 80px;
  height: 40px;
  padding: 0 0.8rem;
  border: 1px solid rgba(var(--c-pink), 0.3);
  border-radius: 6px;
  background: rgba(20, 10, 20, 0.4);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-tab.active, .stat-tab:hover,
.skill-tab.active, .skill-tab:hover {
  background: rgba(var(--c-pink), 0.25);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 12px rgba(var(--c-pink), 0.3);
}

.skill-tab {
  min-width: 100px;
}

/* 战斗风格表格 */
.battle-table .battle-icon-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
}

.battle-table .value-cell {
  line-height: 1.6;
  border-color: rgba(241, 239, 235, 0.1);
}

/* 共鸣回路表格 */
.circuit-table .circuit-icon-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
  vertical-align: top;
}

.circuit-table .value-cell {
  line-height: 1.8;
  border-color: rgba(241, 239, 235, 0.1);
  font-size: 0.9rem;
}

/* 共鸣链表格 */
.resonance-table .resonance-name-cell {
  text-align: center;
  padding: 8px;
  background: transparent;
  border-color: rgba(241, 239, 235, 0.1);
  vertical-align: top;
}

.resonance-table .value-cell {
  line-height: 1.8;
  border-color: rgba(241, 239, 235, 0.1);
  font-size: 0.9rem;
}

.resonance-table .text-gold {
  color: #c0a66a;
}

/* 突破材料表格 */
.material-table .material-cell {
  padding: 4px 8px;
  border-style: hidden;
  vertical-align: middle;
}

.material-table .material-cell img {
  vertical-align: middle;
  margin-right: 4px;
}

.material-table .material-cell a {
  color: rgb(var(--c-light-blue));
}

/* 技能图片 */
.skill-images {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.skill-divider {
  border: none;
  border-top: 1px solid rgba(var(--c-pink), 0.2);
  margin: 1.5rem 0;
}

.skill-energy {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  font-size: 0.95rem;
}

/* 技能内容 */
.skill-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skill-name {
  color: #bb9f5e;
  font-size: 1.5rem;
  margin: 0;
}

.skill-details {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}

.skill-details p {
  margin: 0.6rem 0;
}

.skill-branch {
  margin: 1rem 0;
}

.skill-data-details {
  margin-top: 1rem;
}

.skill-data-summary {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  padding: 0.5rem 0;
}

.skill-data-table {
  overflow-x: auto;
  margin-top: 0.5rem;
}

.data-table {
  min-width: 1100px;
}

.data-table th {
  background: #f0ece4;
  color: #333;
  font-weight: 600;
  text-align: center;
  padding: 8px;
  white-space: nowrap;
}

.data-table td {
  font-size: 0.85rem;
  text-align: center;
  white-space: nowrap;
}

.data-table td:first-child {
  text-align: left;
  background: rgba(var(--c-deep-blue), 0.08);
}

.data-table tbody tr:nth-child(odd) td:first-child {
  background: rgba(var(--c-deep-blue), 0.12);
}

.skill-placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

/* 文本颜色 */
.text-gold {
  color: #f1c40f;
  font-weight: 600;
}

.text-red {
  color: #e03e2d;
  font-weight: 600;
}

.text-gold-underline {
  color: #f1c40f;
  font-weight: 600;
  text-decoration: underline;
}

.text-italic {
  color: #34495e;
  font-style: italic;
}

.text-muted {
  color: #aaa;
}

.story-content {
  line-height: 1.5;
}

.story-content p {
  margin: 0.4rem 0;
}

/* 导航 */
.side-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-start;
  z-index: 100;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.collapsed {
  transform: translate(calc(100% + 20px), -50%);
}

.toggle-btn {
  background: transparent;
  border: none;
  color: rgba(var(--c-pink), 0.8);
  padding: 15px 5px;
  cursor: pointer;
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--c-pink), 0.8);
  transform: translateY(-50%) scale(1.1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-height: 90vh;
  overflow-y: auto;
  background: transparent;
}

.nav-content::-webkit-scrollbar {
  display: none;
}

.nav-btn {
  flex-shrink: 0;
  background: rgba(20, 10, 20, 0.7);
  border: 1px solid rgba(var(--c-pink), 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  writing-mode: vertical-lr;
  text-align: center;
  min-height: 60px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(var(--c-pink), 0.2);
  border-color: rgb(var(--c-pink));
  color: #fff;
  box-shadow: 0 0 15px rgba(var(--c-pink), 0.5);
  transform: translateX(-5px);
}

/* 一级导航 */
.nav-l1 {
  border-color: rgba(var(--c-pink), 0.5);
  font-weight: 600;
}

.nav-l1.expanded {
  background: rgba(var(--c-pink), 0.25);
  border-color: rgb(var(--c-pink));
  color: #fff;
}

/* 二级导航组 */
.nav-l2-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: -2px 0 4px 0;
  padding-left: 0;
}

/* 二级导航按钮 */
.nav-l2 {
  writing-mode: horizontal-tb;
  min-height: auto;
  height: auto;
  width: 42px;
  padding: 6px 4px;
  font-size: 12px;
  letter-spacing: 0;
  border-color: rgba(var(--c-pink), 0.15);
  background: rgba(20, 10, 20, 0.4);
}

.nav-l2:hover {
  transform: translateX(-3px);
}

.top-btn {
  writing-mode: horizontal-tb;
  height: auto;
  min-height: auto;
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  letter-spacing: 0;
}

/* 全屏图片 */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.fullscreen-overlay img {
  max-width: 92vw;
  max-height: 92vh;
  object-fit: contain;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

/* 响应式 */
@media screen and (max-width: 992px) {
  .content-section {
    padding: 4rem 1rem 2rem 1rem;
  }
  .role-content {
    flex-direction: column;
  }
  .role-images .figure img {
    max-height: 400px;
  }
  .hr-line {
    width: 100%;
  }
  .stat-tabs, .skill-tabs {
    justify-content: center;
  }
}
</style>
