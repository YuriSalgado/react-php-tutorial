// componente que torna um produto único
var ProductRow = React.createClass({
    render: function() {
    return (
        <tr>
            <td>{this.props.product.name}</td>
            <td>{this.props.product.description}</td>
            <td>${parseFloat(this.props.product.price).toFixed(2)}</td>
            <td>{this.props.product.category_name}</td>
            <td>
                <a href='#'
                    onClick={() => this.props.changeAppMode('readOne', this.props.product.id)}
                    className='btn btn-info m-r-1em'> Ler
                </a>
                <a href='#'
                    onClick={() => this.props.changeAppMode('update', this.props.product.id)}
                    className='btn btn-primary m-r-1em'> Editar
                </a>
                <a
                    onClick={() => this.props.changeAppMode('delete', this.props.product.id)}
                    className='btn btn-danger'> Excluir
                </a>
            </td>
        </tr>
        );
    }
});
// componente para a tabela inteira produtos
var ProductsTable = React.createClass({
    render: function() { 
    var rows = this.props.products
        .map(function(product, i) {
            return (
                <ProductRow
                    key={i}
                    product={product}
                    changeAppMode={this.props.changeAppMode} />
            );
        }.bind(this)); 
        return(
            !rows.length
                ? <div className='alert alert-danger'>Não foram encontrados produtos.</div>
                :
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Categoria</th>
                            <th>Açao</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
        );
    }
});
// componente que contém as funcionalidades que aparecem na parte superior
// a tabela produtos: criar produtos
var TopActionsComponent = React.createClass({
    render: function() {
        return (
            <div>
                <a href='#'
                    onClick={() => this.props.changeAppMode('create')}
                    className='btn btn-primary margin-bottom-1em'> Criar produto
                </a>
            </div>
        );
    }
});
// componente que contém toda a lógica e outros componentes menores
// formar o ler produtos view
var ReadProductsComponent = React.createClass({
    getInitialState: function() {
        return {
            products: []
        };
    }, 
    // buscar todos os produtos e armazená-los como o estado desse componente
    componentDidMount: function() {
        this.serverRequest = $.get("api/read_all_products.php", function (products) {
            this.setState({
                products: JSON.parse(products)
            });
        }.bind(this));
    }, 
    // matar produto no caso de o pedido ainda está pendente
    componentWillUnmount: function() {
        this.serverRequest.abort();
    }, 
    render: function() {
        // lista de produtos
        var filteredProducts = this.state.products;
        $('.page-header h1').text('Ler os produtos'); 
        return (
            <div className='overflow-hidden'>
                <TopActionsComponent changeAppMode={this.props.changeAppMode} />
 
                <ProductsTable
                    products={filteredProducts}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});

var ReadOneProductComponent = React.createClass({
    getInitialState: function() {
        // certificar-se de que não existem outros valores são definidos
        return {
            id: 0,
            name: '',
            description: '',
            price: 0,
            category_name: ''
        };
    }, 
    // ler um produto à base de dados de identificação do produto
    componentDidMount: function() { 
        var productId = this.props.productId; 
        this.serverRequestProd = $.post("api/read_one_product.php",
            {prod_id: productId},
            function (product) {
                var p = JSON.parse(product)[0];
                this.setState({category_name: p.category_name});
                this.setState({id: p.id});
                this.setState({name: p.name});
                this.setState({description: p.description});
                this.setState({price: p.price});
            }.bind(this)); 
        $('.page-header h1').text('Read Product');
    },
    // matar a busca de dados do produto no caso de o pedido ainda está pendente
    componentWillUnmount: function() {
        this.serverRequestProd.abort();
    }, 
    // mostrar dados de único produto em tabela
    render: function() {
        return (
            <div>
                <a href='#'
                    onClick={() => this.props.changeAppMode('read')}
                    className='btn btn-primary margin-bottom-1em'>
                    Leia os produtos
                </a> 
                <form onSubmit={this.onSave}>
                    <table className='table table-bordered table-hover'>
                        <tbody>
                        <tr>
                            <td>Nome</td>
                            <td>{this.state.name}</td>
                        </tr> 
                        <tr>
                            <td>Descrição</td>
                            <td>{this.state.description}</td>
                        </tr> 
                        <tr>
                            <td>Preço ($)</td>
                            <td>${parseFloat(this.state.price).toFixed(2)}</td>
                        </tr> 
                        <tr>
                            <td>Categoria</td>
                            <td>{this.state.category_name}</td>
                        </tr> 
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
});

var UpdateProductComponent = React.createClass({
	getInitialState: function() {
		return {
			categories: [],
			selectedCategoryId: 0,
			id: 0,
			name: '',
			description: '',
			price: 0,
			successUpdate: null
		};
	},
	componentDidMount: function() {
		this.serverRequestCat = $.get("api/read_all_categories.php", function (categories) {
			this.setState({
				categories: JSON.parse(categories)
			});
		}.bind(this));
		var productId = this.props.productId;
		this.serverRequestProd = $.post("api/read_one_product.php",
			{prod_id: productId},
			function (product) {
				var p = JSON.parse(product)[0];
				this.setState({selectedCategoryId: p.category_id});
				this.setState({id: p.id});
				this.setState({name: p.name});
				this.setState({description: p.description});
				this.setState({price: p.price});
			}.bind(this));
		$('.page-header h1').text('Atualizar Produto');
	},
	componentWillUnmount: function() {
		this.serverRequestCat.abort();
		this.serverRequestProd.abort();
	},
	// lidar com mudança categoria
	onCategoryChange: function(e) {
		this.setState({selectedCategoryId: e.target.value});
	},
	// lidar com mudança nome
	onNameChange: function(e) {
		this.setState({name: e.target.value});
	},
	// lidar com mudança descrição
	onDescriptionChange: function(e) {
		this.setState({description: e.target.value});
	},
	// lidar com mudança preço
	onPriceChange: function(e) {
		this.setState({price: e.target.value});
	},
	onSave: function(e){
		$.post("api/update_product.php", {
				id: this.state.id,
				name: this.state.name,
				description: this.state.description,
				price: this.state.price,
				category_id: this.state.selectedCategoryId
			},
			function(res){
				this.setState({successUpdate: res});
			}.bind(this)
		);
		e.preventDefault();
	},
	render: function() {
		var categoriesOptions = this.state.categories.map(function(category){
			return (
				<option key={category.id} value={category.id}>{category.name}</option>
			);
		});
		return (
			<div>
				{
					this.state.successUpdate == "true" ?
						<div className='alert alert-success'>
							O produto foi atualizado.
						</div>
					: null
				}
				{
					this.state.successUpdate == "false" ?
						<div className='alert alert-danger'>
							Não é possível atualizar o produto. Por favor, tente novamente.
						</div>
					: null
				}
				<a href='#'
					onClick={() => this.props.changeAppMode('read')}
					className='btn btn-primary margin-bottom-1em'>
					Leia os produtos
				</a>
				<form onSubmit={this.onSave}>
					<table className='table table-bordered table-hover'>
						<tbody>
						<tr>
							<td>Nome</td>
							<td>
								<input
									type='text'
									className='form-control'
									value={this.state.name}
									required
									onChange={this.onNameChange} />
							</td>
						</tr>
						<tr>
							<td>Descrição</td>
							<td>
								<textarea
									type='text'
									className='form-control'
									required
									value={this.state.description}
									onChange={this.onDescriptionChange}></textarea>
							</td>
						</tr>
						<tr>
							<td>Preço ($)</td>
							<td>
								<input
									type='number'
									step="0.01"
									className='form-control'
									value={this.state.price}
									required
									onChange={this.onPriceChange}/>
							</td>
						</tr>
						<tr>
							<td>Category</td>
							<td>
								<select
									onChange={this.onCategoryChange}
									className='form-control'
									value={this.state.selectedCategoryId}>
									<option value="-1">Selecione a Categoria...</option>
									{categoriesOptions}
									</select>
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<button
									className='btn btn-primary'
									onClick={this.onSave}>Salvar alterações</button>
							</td>
						</tr>
						</tbody>
					</table>
				</form>
			</div>
		);
	}
});

var DeleteProductComponent = React.createClass({ 
    componentDidMount: function() {
        $('.page-header h1').text('Excluir produto');
    }, 
    onDelete: function(e){
        var productId = this.props.productId; 
        $.post("api/delete_products.php",
            { del_ids: [productId] },
            function(res){
                this.props.changeAppMode('read');
            }.bind(this)
        );
    }, 
    render: function() {
        return (
            <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6'>
                    <div className='panel panel-default'>
                        <div className='panel-body text-align-center'>Você tem certeza?</div>
                        <div className='panel-footer clearfix'>
                            <div className='text-align-center'>
                                <button onClick={this.onDelete}
                                    className='btn btn-danger m-r-1em'>Sim</button>
                                <button onClick={() => this.props.changeAppMode('read')}
                                    className='btn btn-primary'>Não</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'></div>
            </div>
        );
    }
});

// Criamos uma classe para o nosso MainApp
var MainApp = React.createClass({
    getInitialState: function() {
		return {
			currentMode: 'read',
			productId: null
		};
	},
	changeAppMode: function(newMode, productId){
		this.setState({currentMode: newMode});
		if(productId !== undefined){
			this.setState({productId: productId});
		}
	},
	render: function() {
		var modeComponent =
			<ReadProductsComponent
			changeAppMode={this.changeAppMode} />;
		switch(this.state.currentMode){
			case 'read':
				break;
			case 'readOne':
            	modeComponent = <ReadOneProductComponent productId={this.state.productId} changeAppMode={this.changeAppMode}/>;
            	break;
			case 'create':
				modeComponent = <CreateProductComponent changeAppMode={this.changeAppMode}/>;
				break;
			case 'update':
				modeComponent = <UpdateProductComponent productId={this.state.productId} changeAppMode={this.changeAppMode}/>;
				break;
			case 'delete':
				modeComponent = <DeleteProductComponent productId={this.state.productId} changeAppMode={this.changeAppMode}/>;
				break;
			default:
				break;
		}
		return modeComponent;
    }
});

// Criamos uma nova classe conter a lógica de criacao de um produto
var CreateProductComponent = React.createClass({
	// Define o primeiro estado do nosso produto
	getInitialState: function() {
		return {
			categories: [],
			selectedCategoryId: -1,
			name: '',
			description: '',
			price: '',
			successCreation: null
		};
	},
	// Imediatamente apos o estado inicial, chamado a funcao abaixo
	componentDidMount: function() {
		this.serverRequest = $.get("api/read_all_categories.php", function (categories) {
			this.setState({
				categories: JSON.parse(categories)
			});
		}.bind(this));
		$('.page-header h1').text('Criar produto');
	},
	// Define os procedimentos para desmontar o estado do nosso produto
	componentWillUnmount: function() {
		this.serverRequest.abort();
	},	
	// Métodos personalizados ouvintes de campos
	// lidar com a mudança categoria
	onCategoryChange: function(e) {
		this.setState({selectedCategoryId: e.target.value});
	},
	// lidar com a mudança nome
	onNameChange: function(e) {
		this.setState({name: e.target.value});
	},
	// lidar com a mudança descricao
	onDescriptionChange: function(e) {
		this.setState({description: e.target.value});
	},
	// lidar com a mudança preço
	onPriceChange: function(e) {
		this.setState({price: e.target.value});
	},
	// lidar com submit do formulário limpando os campos do produto após submit
	onSave: function(e){
		$.post("api/create_product.php", {
				name: this.state.name,
				description: this.state.description,
				price: this.state.price,
				category_id: this.state.selectedCategoryId
			},
			function(res){
				this.setState({successCreation: res});
				this.setState({name: ""});
				this.setState({description: ""});
				this.setState({price: ""});
				this.setState({selectedCategoryId: -1});
			}.bind(this)
		);
		e.preventDefault();
	},
	// Eis o html do nosso formulario
	render: function() {
		// Faça categorias como opção para marcar como seleção.
		var categoriesOptions = this.state.categories.map(function(category){
			return (
				<option key={category.id} value={category.id}>{category.name}</option>
			);
		});
		/*
		- Informar ao usuário se um produto foi criado
		- Informar ao usuário se não for possível criar produto
		- Botão para voltar à lista de produtos
		- Forma para criar um produto
		*/
		return (
		<div>
			{

				this.state.successCreation == "true" ?
					<div className='alert alert-success'>
						O produto foi salvo.
					</div>
				: null
			}

			{

				this.state.successCreation == "false" ?
					<div className='alert alert-danger'>
						Não foi possível salvar produto. Por favor, tente novamente.
					</div>
				: null
			}

			<a href='#'
				onClick={() => this.props.changeAppMode('read')}
				className='btn btn-primary margin-bottom-1em'> Leia os produtos
			</a>


			<form onSubmit={this.onSave}>
				<table className='table table-bordered table-hover'>
				<tbody>
					<tr>
						<td>Nome</td>
						<td>
							<input
							type='text'
							className='form-control'
							value={this.state.name}
							required
							onChange={this.onNameChange} />
						</td>
					</tr>

					<tr>
						<td>Descrição</td>
						<td>
							<textarea
							type='text'
							className='form-control'
							required
							value={this.state.description}
							onChange={this.onDescriptionChange}>
							</textarea>
						</td>
					</tr>

					<tr>
						<td>Preço ($)</td>
						<td>
							<input
							type='number'
							step="0.01"
							className='form-control'
							value={this.state.price}
							required
							onChange={this.onPriceChange}/>
						</td>
					</tr>

					<tr>
						<td>Categoria</td>
						<td>
							<select
							onChange={this.onCategoryChange}
							className='form-control'
							value={this.state.selectedCategoryId}>
							<option value="-1">Selecione a Categoria...</option>
							{categoriesOptions}
							</select>
						</td>
					</tr>

					<tr>
						<td></td>
						<td>
							<button
							className='btn btn-primary'
							onClick={this.onSave}>Save</button>
						</td>
					</tr>
					</tbody>
				</table>
			</form>
		</div>
		);
	}
});

// Inicializar o Dom Virtual
ReactDOM.render(
    <MainApp />,
    document.getElementById('content')
);