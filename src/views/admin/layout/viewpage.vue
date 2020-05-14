<template>
	<!-- 布局母版组件，结构与样式解耦 -->
	<el-col :span="24">
		<div class="container">
	  	<slot></slot>
			<el-row type="flex" justify="space-between" class="row-search-wrap row-margin-bottom">
	  	  <el-col :span="8">
					<slot name="counting"></slot>
				</el-col>
  			<el-col :span="8">
				  <slot name="search"></slot>
  			</el-col>
  			<el-col :span="8" >
					<slot name="buttons"></slot>
  			</el-col>
	  	</el-row>
	  	<el-row>
				<el-col>
					<slot name="mytable"></slot>
				</el-col>
	  	  <el-col>
					<slot name="pagination"></slot>
	  	  </el-col>
	  	</el-row>
	  	</div>
	</el-col>
</template>
